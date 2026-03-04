<!-- NAV_TOP_START -->
[Previous](README.md) | [Index](../../00-index.md) | [Next](../06_함수기초/README.md)
<!-- NAV_TOP_END -->

# 05.1 shadowing 버그 상세 정리

`shadowing`은 **안쪽 블록에서 같은 이름의 변수를 새로 선언(`:=`)** 하면서,
바깥 변수를 가려버리는 현상이다.

Go에서는 컴파일이 통과해도 논리 버그를 만들기 쉬워서,
특히 `err` 처리 코드에서 자주 사고가 난다.

---

## 1. 왜 위험한가

- 코드가 겉보기에는 맞아 보인다.
- 로그에는 에러가 찍히는데 함수는 `nil`을 반환할 수 있다.
- 리뷰할 때 `=`와 `:=` 차이를 놓치기 쉽다.
- 테스트가 실패 경로를 충분히 덮지 않으면 프로덕션에서 늦게 발견된다.

핵심: **같은 이름이더라도 같은 변수가 아니다.**

---

## 2. 가장 흔한 버그 패턴

## 2.1 `if` short statement + `err :=` 그림자 버그

```go
func writeConfig(path string, body []byte) error {
	f, err := os.Create(path)
	if err != nil {
		return err
	}
	defer f.Close()

	if _, err := f.Write(body); err != nil {
		// 여기 err는 if 블록 안의 "새 변수"
		log.Printf("write failed: %v", err)
	}

	// 바깥 err는 여전히 nil일 수 있다.
	return err
}
```

문제:

- `if _, err := ...`에서 `err`가 새로 선언된다.
- 블록 밖 `return err`는 바깥 `err`를 반환한다.
- 결과적으로 쓰기 실패가 발생해도 `nil`을 반환할 수 있다.

### 안전한 수정

```go
func writeConfig(path string, body []byte) error {
	f, err := os.Create(path)
	if err != nil {
		return err
	}
	defer f.Close()

	_, err = f.Write(body) // 선언이 아니라 재할당
	if err != nil {
		return fmt.Errorf("write config: %w", err)
	}

	return nil
}
```

---

## 2.2 분기마다 같은 이름 재선언

```go
func load(userID string) error {
	data, err := readCache(userID)
	if err != nil {
		data, err := readDB(userID) // data, err 모두 새 변수
		if err != nil {
			return err
		}
		_ = data
	}
	return err // 바깥 err를 반환
}
```

문제:

- `if` 내부에서 `data, err :=`를 쓰면 바깥 `data`, `err`와 분리된다.
- 흐름이 길어질수록 어떤 변수가 살아있는지 헷갈린다.

수정 원칙:

- 기존 변수를 업데이트할 때는 `=`를 사용한다.
- 다른 의미라면 이름을 분리한다 (`dbData`, `dbErr` 등).

---

## 2.3 루프 안의 `:=`로 의도와 다른 값 사용

```go
sum := 0
for _, n := range nums {
	if n, err := normalize(n); err == nil {
		sum += n // 여기 n은 if 블록의 n
	}
}
```

이 코드는 의도적으로 쓸 수도 있지만, 리뷰 포인트가 많다.

- 바깥 `n`과 안쪽 `n`이 다르다.
- 디버깅 시 로그/브레이크포인트 해석이 어려워진다.

가독성 우선 버전:

```go
sum := 0
for _, n := range nums {
	normalized, err := normalize(n)
	if err != nil {
		continue
	}
	sum += normalized
}
```

---

## 3. 실무에서 쓰는 방지 규칙

- 에러를 이어서 처리할 때는 `err = ...`를 기본으로 둔다.
- `if x, err := ...` 패턴은 "그 블록 안에서 즉시 return"할 때만 사용한다.
- 같은 이름이 두 번 나오면 범위를 먼저 확인한다.
- `return err` 직전에 "이 err가 어느 스코프 변수인지" 확인한다.
- 리뷰에서 `:=`를 발견하면 새 변수 생성 의도인지 반드시 질문한다.

---

## 4. 도구로 검출하기

기본 `go vet`만으로는 모든 shadowing을 잡지 못한다.

shadow analyzer를 추가하면 도움이 된다.

```bash
go install golang.org/x/tools/go/analysis/passes/shadow/cmd/shadow@latest
go vet -vettool=$(which shadow) ./...
```

보조로 정적 분석 도구(`staticcheck`)도 함께 사용하는 것이 좋다.

---

## 5. 학습용 미션

1. 아래 조건을 만족하는 `saveUser` 함수를 작성한다.
- 파일 열기/쓰기/닫기 모두 에러를 정확히 반환한다.
- `err :=` shadowing 없이 작성한다.

2. 테스트 2개를 작성한다.
- 정상 저장 케이스
- 쓰기 실패 케이스(권한 없는 경로 등)

3. 코드 리뷰 체크
- 함수 마지막 `return`에서 반환되는 `err`의 스코프를 말로 설명한다.

---

## 6. 요약

- shadowing 버그의 핵심 원인은 `:=`로 같은 이름의 새 변수를 만드는 것이다.
- 특히 `err` 처리에서 "로그는 실패인데 반환은 성공" 같은 치명적 버그를 만든다.
- 예방의 기본은 단순하다: **기존 변수 업데이트는 `=`**, 새 의미의 값은 **다른 이름**.

<!-- NAV_BOTTOM_START -->
[Previous](README.md) | [Index](../../00-index.md) | [Next](../06_함수기초/README.md)
<!-- NAV_BOTTOM_END -->

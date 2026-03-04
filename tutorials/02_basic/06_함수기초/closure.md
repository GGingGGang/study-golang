<!-- NAV_TOP_START -->
[Previous](defer.md) | [Index](../../00-index.md) | [Next](../07_포인터값/README.md)
<!-- NAV_TOP_END -->

# 06.2 클로저 상세 정리

클로저(closure)는 "함수 + 그 함수가 선언될 때의 주변 스코프 상태"를 함께 묶은 값이다.
Go에서는 함수를 1급 값으로 다루기 때문에, 클로저를 반환하거나 변수에 담아 상태를 유지할 수 있다.

---

## 1. 클로저의 핵심 동작

```go
func counter() func() int {
	n := 0
	return func() int {
		n++
		return n
	}
}
```

`counter`가 끝난 뒤에도 반환된 내부 함수는 `n`을 계속 참조한다.

```go
next := counter()
fmt.Println(next()) // 1
fmt.Println(next()) // 2
fmt.Println(next()) // 3
```

핵심:

- 클로저는 값을 복사한 스냅샷이 아니라 "변수 자체"를 캡처한다.
- 같은 클로저 인스턴스를 여러 번 호출하면 같은 상태를 공유한다.

---

## 2. 렉시컬 스코프(lexical scope)

함수는 선언된 위치의 바깥 변수를 볼 수 있다.

```go
func makePrefixer(prefix string) func(string) string {
	return func(s string) string {
		return prefix + s
	}
}
```

```go
hello := makePrefixer("hello, ")
fmt.Println(hello("go")) // hello, go
```

`prefix`는 `makePrefixer`가 끝난 뒤에도 클로저가 계속 사용한다.

---

## 3. 클로저 인스턴스별 상태 분리

각 호출은 서로 다른 캡처 상태를 만든다.

```go
a := counter()
b := counter()

fmt.Println(a(), a()) // 1 2
fmt.Println(b(), b()) // 1 2
```

`a`와 `b`는 독립된 `n`을 가진다.

---

## 4. 자주 쓰는 실무 패턴

## 4.1 설정을 고정한 함수 생성

```go
func makeValidator(minLen int) func(string) bool {
	return func(s string) bool {
		return len(s) >= minLen
	}
}
```

## 4.2 함수형 옵션(Functional Options)

```go
type Option func(*Server)

func WithTimeout(d time.Duration) Option {
	return func(s *Server) {
		s.timeout = d
	}
}
```

클로저로 옵션 값을 캡처해 구성 코드를 깔끔하게 만든다.

---

## 5. 루프 변수 캡처 주의

클로저는 "변수"를 잡기 때문에, 루프 변수 처리에 신경 써야 한다.

```go
func buildWorkers(ids []int) []func() {
	out := make([]func(), 0, len(ids))
	for _, id := range ids {
		id := id // 반복마다 새 변수로 고정
		out = append(out, func() {
			fmt.Println("worker", id)
		})
	}
	return out
}
```

실무 기준:

- 팀 Go 버전이 섞여 있거나 코드를 오래 유지할 가능성이 있으면, 위처럼 반복 변수 복사 습관이 안전하다.
- 고루틴과 함께 사용할 때는 값이 언제 캡처되는지 테스트로 확인한다.

---

## 6. 동시성과 데이터 레이스

클로저가 공유 상태를 캡처하면 고루틴 환경에서 레이스가 생길 수 있다.

```go
func broken() {
	n := 0
	inc := func() { n++ } // 공유 상태
	for i := 0; i < 1000; i++ {
		go inc()
	}
}
```

안전한 방식:

1. `sync.Mutex`로 보호
2. `atomic` 사용
3. 고루틴별 로컬 상태로 분리

클로저 자체가 문제가 아니라 "공유 가변 상태"가 문제다.

---

## 7. 메모리 관점 주의점

클로저가 큰 객체를 캡처하면 예상보다 오래 메모리에 남을 수 있다.

```go
func holdLarge(buf []byte) func() int {
	return func() int {
		return len(buf) // buf 전체 생존
	}
}
```

필요한 값만 복사해서 캡처하면 부담을 줄일 수 있다.

```go
func holdLen(buf []byte) func() int {
	n := len(buf)
	return func() int { return n }
}
```

---

## 8. 테스트 포인트

1. 상태 유지 여부
- 같은 클로저를 여러 번 호출했을 때 값이 누적되는지 확인

2. 상태 분리 여부
- 서로 다른 팩토리 호출이 독립 상태를 가지는지 확인

3. 루프 캡처 안전성
- 기대한 순서/값이 출력되는지 확인

---

## 9. 요약

- 클로저는 함수와 주변 상태를 묶어 동작한다.
- 상태를 가진 함수, 옵션 생성, 콜백 구성에 매우 유용하다.
- 루프 변수 캡처와 동시성 공유 상태는 반드시 의식해야 한다.
- 메모리 유지 기간도 설계 포인트다.

<!-- NAV_BOTTOM_START -->
[Previous](defer.md) | [Index](../../00-index.md) | [Next](../07_포인터값/README.md)
<!-- NAV_BOTTOM_END -->

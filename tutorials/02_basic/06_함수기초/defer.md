<!-- NAV_TOP_START -->
[Previous](function.md) | [Index](../../00-index.md) | [Next](closure.md)
<!-- NAV_TOP_END -->

# 06.1 defer 상세 정리

`defer`는 "이 함수가 끝날 때 실행할 작업"을 예약하는 문법이다.
파일 닫기, 락 해제, 트랜잭션 롤백 같은 정리(cleanup) 코드를 안전하게 유지하는 데 핵심이다.

---

## 1. 실행 시점과 평가 시점

핵심은 아래 두 줄이다.

1. `defer`에 등록되는 함수 호출은 현재 시점에 예약된다.
2. 호출 인자는 `defer`를 만나는 즉시 평가된다.

```go
func demo() {
	n := 1
	defer fmt.Println("defer:", n) // 여기서 n=1로 평가됨
	n = 2
	fmt.Println("now:", n) // 2
}
```

출력:

```text
now: 2
defer: 1
```

변수의 "최신 값"을 defer 시점이 아닌 종료 시점에 보고 싶으면 클로저를 사용한다.

```go
func demo() {
	n := 1
	defer func() { fmt.Println("defer:", n) }() // 종료 시점에 n을 읽음
	n = 2
	fmt.Println("now:", n)
}
```

출력:

```text
now: 2
defer: 2
```

---

## 2. 실행 순서: LIFO

`defer`는 스택처럼 동작한다. 마지막에 등록한 defer가 먼저 실행된다.

```go
func order() {
	defer fmt.Println("first")
	defer fmt.Println("second")
	defer fmt.Println("third")
}
```

출력:

```text
third
second
first
```

여러 자원을 열었을 때 역순으로 닫히므로 정리 순서를 자연스럽게 맞출 수 있다.

---

## 3. 반환값과 defer

`defer`는 `return` 이후, 함수가 실제로 끝나기 직전에 실행된다.
그래서 named return 값을 마지막에 보정하는 패턴이 가능하다.

```go
func work() (err error) {
	defer func() {
		if err != nil {
			err = fmt.Errorf("work failed: %w", err)
		}
	}()

	err = errors.New("db timeout")
	return
}
```

주의:

- named return 수정은 강력하지만 남용하면 흐름 파악이 어렵다.
- 팀 규칙이 없다면 "로깅/정리"에 defer를 쓰고, 반환값 변형은 최소화하는 편이 안전하다.

---

## 4. panic 상황에서도 defer는 실행된다

함수 내부에서 panic이 발생해도 해당 스택 프레임의 defer는 실행된다.
그래서 락 해제, 파일 닫기 같은 최소 정리는 보장할 수 있다.

```go
func critical(mu *sync.Mutex) {
	mu.Lock()
	defer mu.Unlock()

	panic("unexpected")
}
```

`recover`도 defer 안에서만 동작한다.

```go
func safeRun(fn func()) (err error) {
	defer func() {
		if r := recover(); r != nil {
			err = fmt.Errorf("panic recovered: %v", r)
		}
	}()
	fn()
	return nil
}
```

---

## 5. 실무 패턴

## 5.1 파일 정리

```go
func readFirstLine(path string) (string, error) {
	f, err := os.Open(path)
	if err != nil {
		return "", err
	}
	defer f.Close()

	sc := bufio.NewScanner(f)
	if !sc.Scan() {
		return "", sc.Err()
	}
	return sc.Text(), nil
}
```

## 5.2 락 해제

```go
func (c *Counter) Inc() {
	c.mu.Lock()
	defer c.mu.Unlock()
	c.n++
}
```

## 5.3 트랜잭션 롤백 가드

```go
func createUser(ctx context.Context, db *sql.DB, name string) (err error) {
	tx, err := db.BeginTx(ctx, nil)
	if err != nil {
		return err
	}
	defer tx.Rollback() // Commit 성공 시 이미 종료되어 no-op

	if _, err = tx.ExecContext(ctx, "INSERT INTO users(name) VALUES(?)", name); err != nil {
		return err
	}
	return tx.Commit()
}
```

---

## 6. 주의할 점

1. `defer`는 함수 단위다.
루프 블록이 끝날 때가 아니라, 감싸는 함수가 끝날 때 실행된다.

```go
for _, name := range names {
	f, _ := os.Open(name)
	defer f.Close() // 루프마다 누적됨
}
```

파일이 많으면 FD 고갈 위험이 생긴다. 루프 안에서 즉시 닫거나, 루프 본문을 별도 함수로 분리한다.

2. 아주 뜨거운(초고빈도) 경로에서는 defer 비용이 누적될 수 있다.
최신 Go에서는 비용이 크게 줄었지만, 병목 구간이면 벤치마크로 판단한다.

3. `defer`에서 에러를 무시하지 말고 필요하면 로그를 남긴다.

```go
defer func() {
	if err := f.Close(); err != nil {
		log.Printf("close failed: %v", err)
	}
}()
```

---

## 7. 요약

- `defer`는 종료 시 정리 코드를 보장해준다.
- 인자는 defer 시점에 평가되고, 실행은 함수 종료 직전이다.
- 여러 defer는 LIFO로 실행된다.
- 루프 안 누적 defer, 과도한 named return 수정은 주의한다.

<!-- NAV_BOTTOM_START -->
[Previous](function.md) | [Index](../../00-index.md) | [Next](closure.md)
<!-- NAV_BOTTOM_END -->

<!-- NAV_TOP_START -->
[Previous](README.md) | [Index](../../00-index.md) | [Next](defer.md)
<!-- NAV_TOP_END -->

# 06.0 함수 선언 형태 정리

아래 세 코드는 모두 `func`로 시작하지만, 의미가 조금씩 다르다.

```go
func readFirstLine(path string) (string, error)
func (c *Counter) Inc()
func createUser(ctx context.Context, db *sql.DB, name string) (err error)
```

---

## 1. 공통 뼈대

```go
func [receiver] Name(params) (results) {
    // body
}
```

- `receiver`가 없으면 일반 함수
- `receiver`가 있으면 메서드
- `results`에 이름을 붙이면 named return

---

## 2. 예시별 의미

## 2.1 일반 함수 선언

```go
func readFirstLine(path string) (string, error)
```

- receiver 없음
- 입력: `path string`
- 반환: `string`, `error`
- 보통 독립 로직(파일 읽기, 변환, 계산)에 사용

## 2.2 메서드 선언

```go
func (c *Counter) Inc()
```

- `(c *Counter)`가 receiver
- `Counter` 타입에 속한 동작을 정의
- `*Counter` 포인터 receiver라서 내부 상태(`c.n++`)를 직접 변경 가능

## 2.3 named return이 있는 함수 선언

```go
func createUser(ctx context.Context, db *sql.DB, name string) (err error)
```

- 반환값 `error`에 이름 `err` 부여
- 함수 본문 어디서든 `err`를 참조/수정 가능
- `defer`에서 에러를 감싸거나 정리 로직을 붙일 때 유용

예:

```go
func createUser(ctx context.Context, db *sql.DB, name string) (err error) {
	tx, err := db.BeginTx(ctx, nil)
	if err != nil {
		return err
	}
	defer func() {
		if err != nil {
			_ = tx.Rollback()
		}
	}()

	_, err = tx.ExecContext(ctx, "INSERT INTO users(name) VALUES(?)", name)
	if err != nil {
		return err
	}
	return tx.Commit()
}
```

---

## 3. 한 줄 비교

- `func readFirstLine(...) ...` : 독립 함수
- `func (c *Counter) Inc()` : 타입에 묶인 메서드
- `func createUser(...) (err error)` : named return을 활용한 함수

---

## 4. 실무 기준

- 기본은 일반 함수 + 명시적 `return value, err`
- 상태를 다루는 타입 API는 메서드
- named return은 `defer`와 함께 쓸 이유가 분명할 때만 제한적으로 사용

<!-- NAV_BOTTOM_START -->
[Previous](README.md) | [Index](../../00-index.md) | [Next](defer.md)
<!-- NAV_BOTTOM_END -->

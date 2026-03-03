<!-- NAV_TOP_START -->
[Previous](../34_database_sql/README.md) | [Index](../../00-index.md) | [Next](../36_pprof/README.md)
<!-- NAV_TOP_END -->

# 35. 트랜잭션과 풀

## 이전 챕터 점검 (01~34)
- [ ] 34장에서 기본 DB 연산 함수를 작성했다.

## 학습 목표
- 트랜잭션 경계와 쿼리 타임아웃을 적용한다.

## 핵심 내용
- `BeginTx`, `Commit`, `Rollback`
- context 기반 timeout
- 커넥션 풀 설정

## 예제 코드
```go
package repo

import (
	"context"
	"database/sql"
)

func Transfer(ctx context.Context, db *sql.DB, from, to int64, amount int64) error {
	tx, err := db.BeginTx(ctx, nil)
	if err != nil {
		return err
	}
	defer tx.Rollback()

	if _, err := tx.ExecContext(ctx, "UPDATE account SET balance=balance-? WHERE id=?", amount, from); err != nil {
		return err
	}
	if _, err := tx.ExecContext(ctx, "UPDATE account SET balance=balance+? WHERE id=?", amount, to); err != nil {
		return err
	}
	return tx.Commit()
}
```

## 실습
- 성공/실패 시나리오를 분리해 rollback 동작을 검증한다.

## 완료 기준
- [ ] 트랜잭션 경계가 명확하다.
- [ ] 실패 시 롤백된다.
- [ ] timeout context를 전달한다.

<!-- NAV_BOTTOM_START -->
[Previous](../34_database_sql/README.md) | [Index](../../00-index.md) | [Next](../36_pprof/README.md)
<!-- NAV_BOTTOM_END -->


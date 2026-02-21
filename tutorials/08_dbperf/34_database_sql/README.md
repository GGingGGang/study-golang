# 34. database sql

## 이전 챕터 점검 (01~33)
- [ ] HTTP 계층에서 설정과 오류 흐름을 정리했다.

## 학습 목표
- `database/sql`의 기본 CRUD 흐름을 이해한다.

## 핵심 내용
- `sql.DB` 연결과 `Ping`
- `Exec`, `QueryRow`
- 스캔/에러 처리

## 예제 코드
```go
package repo

import "database/sql"

type User struct {
	ID   int64
	Name string
}

func InsertUser(db *sql.DB, name string) (int64, error) {
	res, err := db.Exec("INSERT INTO users(name) VALUES (?)", name)
	if err != nil {
		return 0, err
	}
	return res.LastInsertId()
}
```

## 실습
- 테스트 DB에서 insert/select 1사이클을 작성한다.

## 완료 기준
- [ ] DB 에러를 상위로 전파한다.
- [ ] 최소 CRUD 2개 이상 구현했다.
- [ ] 테스트 데이터 정리를 수행했다.

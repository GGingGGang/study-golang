# 23. 컨텍스트

## 이전 챕터 점검 (01~22)
- [ ] 22장에서 select + timeout 흐름을 구현했다.

## 학습 목표
- 경계 함수마다 context를 전달한다.

## 핵심 내용
- `context.WithTimeout`
- 취소 전파
- 함수 첫 인자 규칙

## 예제 코드
```go
package main

import (
	"context"
	"fmt"
	"time"
)

func fetch(ctx context.Context) error {
	select {
	case <-time.After(300 * time.Millisecond):
		return nil
	case <-ctx.Done():
		return ctx.Err()
	}
}

func main() {
	ctx, cancel := context.WithTimeout(context.Background(), 100*time.Millisecond)
	defer cancel()

	if err := fetch(ctx); err != nil {
		fmt.Println("fetch error:", err)
	}
}
```

## 실습
- HTTP 핸들러 → 서비스 함수로 context 전달 체인을 만든다.

## 완료 기준
- [ ] timeout/취소를 처리했다.
- [ ] context를 첫 인자로 받는다.
- [ ] 에러를 호출자까지 전파했다.

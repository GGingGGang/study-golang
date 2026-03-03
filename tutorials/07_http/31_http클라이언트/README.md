<!-- NAV_TOP_START -->
[Previous](../30_http서버/README.md) | [Index](../../00-index.md) | [Next](../32_http테스트/README.md)
<!-- NAV_TOP_END -->

# 31. HTTP 클라이언트

## 이전 챕터 점검 (01~30)
- [ ] 30장의 서버 핸들러를 직접 호출해봤다.

## 학습 목표
- 타임아웃/재시도 정책을 가진 HTTP 클라이언트를 작성한다.

## 핵심 내용
- `http.Client{Timeout: ...}`
- 재시도는 멱등 요청에 한정
- 상태코드 기반 분기

## 예제 코드
```go
package main

import (
	"fmt"
	"net/http"
	"time"
)

func GetWithRetry(url string, maxRetry int) (*http.Response, error) {
	client := &http.Client{Timeout: 2 * time.Second}
	var lastErr error

	for i := 0; i <= maxRetry; i++ {
		resp, err := client.Get(url)
		if err == nil && resp.StatusCode < 500 {
			return resp, nil
		}
		if err != nil {
			lastErr = err
		} else {
			resp.Body.Close()
			lastErr = fmt.Errorf("server error: %d", resp.StatusCode)
		}
	}
	return nil, lastErr
}

func main() {}
```

## 실습
- 5xx만 재시도하고 4xx는 즉시 실패하도록 분기한다.

## 완료 기준
- [ ] timeout과 retry 조건을 분리했다.
- [ ] 실패 시 마지막 에러를 반환한다.
- [ ] 멱등성 기준을 notes.md에 적었다.

<!-- NAV_BOTTOM_START -->
[Previous](../30_http서버/README.md) | [Index](../../00-index.md) | [Next](../32_http테스트/README.md)
<!-- NAV_BOTTOM_END -->


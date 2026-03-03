<!-- NAV_TOP_START -->
[Previous](../../06_iodata/29_time타이머/README.md) | [Index](../../00-index.md) | [Next](../31_http클라이언트/README.md)
<!-- NAV_TOP_END -->

# 30. HTTP 서버

## 이전 챕터 점검 (01~29)
- [ ] 29장 ticker 종료 패턴을 이해하고 있다.

## 학습 목표
- 표준 라이브러리로 HTTP 서버와 미들웨어를 구성한다.

## 핵심 내용
- `http.Handler`, `http.HandlerFunc`
- 미들웨어 체이닝
- 서버 타임아웃 설정

## 예제 코드
```go
package main

import (
	"fmt"
	"log"
	"net/http"
	"time"
)

func logging(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()
		next.ServeHTTP(w, r)
		log.Printf("%s %s %v", r.Method, r.URL.Path, time.Since(start))
	})
}

func health(w http.ResponseWriter, r *http.Request) {
	fmt.Fprint(w, "ok")
}

func main() {
	mux := http.NewServeMux()
	mux.HandleFunc("/health", health)

	srv := &http.Server{
		Addr:         ":8080",
		Handler:      logging(mux),
		ReadTimeout:  3 * time.Second,
		WriteTimeout: 3 * time.Second,
	}
	_ = srv.ListenAndServe()
}
```

## 실습
- `/health`, `/version` 핸들러를 만들고 로깅 미들웨어를 적용한다.

## 완료 기준
- [ ] 핸들러와 미들웨어 역할을 설명할 수 있다.
- [ ] 타임아웃 설정을 포함했다.
- [ ] 로컬에서 요청 응답을 확인했다.

<!-- NAV_BOTTOM_START -->
[Previous](../../06_iodata/29_time타이머/README.md) | [Index](../../00-index.md) | [Next](../31_http클라이언트/README.md)
<!-- NAV_BOTTOM_END -->


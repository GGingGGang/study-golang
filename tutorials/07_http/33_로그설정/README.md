<!-- NAV_TOP_START -->
[Previous](../32_http테스트/README.md) | [Index](../../00-index.md) | [Next](../../08_dbperf/34_database_sql/README.md)
<!-- NAV_TOP_END -->

# 33. 로그와 설정

## 이전 챕터 점검 (01~32)
- [ ] 32장에서 핸들러 테스트를 작성해 통과했다.

## 학습 목표
- 설정 로딩 우선순위와 로그 출력을 운영 관점으로 정리한다.

## 핵심 내용
- 설정 우선순위: 기본값 < 파일 < 환경변수
- 구조화 가능한 로그 필드
- 실행 환경 분리(local/stage/prod)

## 예제 코드
```go
package main

import (
	"fmt"
	"os"
)

type Config struct {
	AppEnv string
	Port   string
}

func LoadConfig() Config {
	env := os.Getenv("APP_ENV")
	if env == "" {
		env = "local"
	}
	port := os.Getenv("APP_PORT")
	if port == "" {
		port = "8080"
	}
	return Config{AppEnv: env, Port: port}
}

func main() {
	cfg := LoadConfig()
	fmt.Printf("env=%s port=%s\n", cfg.AppEnv, cfg.Port)
}
```

## 실습
- `.env` 또는 파일 설정 입력을 추가하고 환경변수 우선 적용을 검증한다.

## 완료 기준
- [ ] 설정 우선순위를 코드/문서로 명시했다.
- [ ] 실행 환경별 기본값을 분리했다.
- [ ] 로그에 최소 필수 필드를 포함했다.

<!-- NAV_BOTTOM_START -->
[Previous](../32_http테스트/README.md) | [Index](../../00-index.md) | [Next](../../08_dbperf/34_database_sql/README.md)
<!-- NAV_BOTTOM_END -->


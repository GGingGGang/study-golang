<!-- NAV_TOP_START -->
[Previous](../27_파일경로/README.md) | [Index](../../00-index.md) | [Next](../29_time타이머/README.md)
<!-- NAV_TOP_END -->

# 28. JSON 처리

## 이전 챕터 점검 (01~27)
- [ ] 파일/경로 처리 코드가 정상 동작한다.

## 학습 목표
- JSON 디코딩과 입력 검증을 결합한다.

## 핵심 내용
- `encoding/json`
- 구조체 태그
- 필수 필드 검증

## 예제 코드
```go
package main

import (
	"encoding/json"
	"errors"
)

type Config struct {
	Port int `json:"port"`
}

func ParseConfig(raw []byte) (Config, error) {
	var c Config
	if err := json.Unmarshal(raw, &c); err != nil {
		return Config{}, err
	}
	if c.Port == 0 {
		return Config{}, errors.New("port is required")
	}
	return c, nil
}

func main() {}
```

## 실습
- 잘못된 JSON/필수 필드 누락 케이스를 테스트로 추가한다.

## 완료 기준
- [ ] 디코딩 에러를 처리했다.
- [ ] 검증 로직을 분리했다.
- [ ] 정상/실패 테스트를 작성했다.

<!-- NAV_BOTTOM_START -->
[Previous](../27_파일경로/README.md) | [Index](../../00-index.md) | [Next](../29_time타이머/README.md)
<!-- NAV_BOTTOM_END -->


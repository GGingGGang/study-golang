# 12. 에러 처리

## 이전 챕터 점검 (01~11)
- [ ] 작은 인터페이스 + 테스트 더블 패턴을 적용했다.

## 학습 목표
- 문맥을 보존하며 에러를 전파한다.

## 핵심 내용
- 래핑: `fmt.Errorf("...: %w", err)`
- 분류: `errors.Is`, `errors.As`
- sentinel error와 typed error 병행

## 예제 코드
```go
package main

import (
	"errors"
	"fmt"
	"os"
)

var ErrConfigNotFound = errors.New("config not found")

type ParseError struct {
	Line int
	Msg  string
}

func (e *ParseError) Error() string {
	return fmt.Sprintf("line %d: %s", e.Line, e.Msg)
}

func loadConfig(path string) error {
	_, err := os.ReadFile(path)
	if err != nil {
		if errors.Is(err, os.ErrNotExist) {
			return fmt.Errorf("load config: %w", ErrConfigNotFound)
		}
		return fmt.Errorf("load config: %w", err)
	}
	return &ParseError{Line: 3, Msg: "invalid token"}
}
```

```go
package main

import (
	"errors"
	"testing"
)

func TestLoadConfig_NotFound(t *testing.T) {
	err := loadConfig("missing.yaml")
	if !errors.Is(err, ErrConfigNotFound) {
		t.Fatalf("expected ErrConfigNotFound, got %v", err)
	}
}
```

## 실습
1. 파일명/라인을 포함한 파서 에러를 구현한다.
2. `Is/As` 테스트를 각각 1개 이상 작성한다.

## 완료 기준
- [ ] 에러 래핑과 분류를 모두 사용했다.
- [ ] 01~12 누적 규칙(테스트, 포맷, notes.md)을 지켰다.

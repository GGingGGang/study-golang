# 15. 프로젝트 구조

## 이전 챕터 점검 (01~14)
- [ ] 14장 패키지 분리 구조에서 import cycle이 없다.
- [ ] internal 경계가 의도대로 동작한다.

## 학습 목표
- `cmd` 중심 레이아웃으로 실행 진입점을 만든다.
- 빌드 산출물을 일관되게 생성한다.

## 핵심 내용
- `cmd/<app>/main.go` 엔트리포인트
- `internal/...` 도메인 구현
- `go build ./...`로 전체 검증

## 예제 코드
```go
package main

import "fmt"

func main() {
	fmt.Println("study15 app")
}
```

```go
package main

import "testing"

func TestSmoke(t *testing.T) {
	// 엔트리포인트 존재 확인용 스모크 테스트
}
```

## 실습
- `cmd/app/main.go`로 파일 이동
- `go build ./...` 및 실행 확인

## 완료 기준
- [ ] 프로젝트 레이아웃 의도를 설명할 수 있다.
- [ ] 빌드 성공 후 바이너리를 실행했다.
- [ ] 스모크 테스트를 추가했다.

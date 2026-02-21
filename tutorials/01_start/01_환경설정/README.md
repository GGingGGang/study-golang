# 01. 환경 설정

## 이전 챕터 점검
- 시작 챕터이므로 없음.

## 학습 목표
- Go 실행 환경을 점검한다.
- 학습 저장소의 기본 뼈대를 만든다.

## 핵심 내용
- 버전 확인: `go version`
- 환경 확인: `go env GOMOD GOPATH GOROOT`
- 최소 구조: `chapters/`, `projects/`, `notes/`

## 예제 코드
```go
package main

import (
	"fmt"
	"runtime"
)

func main() {
	fmt.Println("Go runtime:", runtime.Version())
}
```

## 실습
1. `go version` 결과를 기록한다.
2. `go env` 핵심 값 3개를 `notes.md`에 정리한다.
3. 챕터별 폴더 구조를 만든다.

## 완료 기준
- [ ] 환경값을 설명할 수 있다.
- [ ] `go run`으로 코드가 실행된다.

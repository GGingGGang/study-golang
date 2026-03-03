<!-- NAV_TOP_START -->
[Previous](../19_퍼징/README.md) | [Index](../../00-index.md) | [Next](../../05_concurrency/21_고루틴/README.md)
<!-- NAV_TOP_END -->

# 20. 정적 분석

## 이전 챕터 점검 (01~19)
- [ ] 테스트, 벤치마크, 퍼징을 최소 1회 이상 실행했다.

## 학습 목표
- `go vet` 경고를 해석하고 근본 원인을 수정한다.

## 핵심 내용
- 포맷 문자열 불일치
- 잘못된 복사/잠금 패턴 경고
- CI에 vet 추가

## 예제 코드
```go
package main

import "fmt"

func main() {
	// vet: Printf 포맷과 인자 타입 불일치
	fmt.Printf("%d", "x")
}
```

```go
package main

import "fmt"

func fixed() {
	fmt.Printf("%s", "x")
}
```

## 실습
- `go vet ./...` 실행
- 경고 1개 이상 수정 후 재실행

## 완료 기준
- [ ] 경고 원인을 설명할 수 있다.
- [ ] 수정 후 vet 경고가 사라졌다.
- [ ] CI 체크 목록에 vet를 추가했다.

<!-- NAV_BOTTOM_START -->
[Previous](../19_퍼징/README.md) | [Index](../../00-index.md) | [Next](../../05_concurrency/21_고루틴/README.md)
<!-- NAV_BOTTOM_END -->


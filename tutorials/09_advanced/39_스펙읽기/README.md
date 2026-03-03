<!-- NAV_TOP_START -->
[Previous](../38_리플렉션/README.md) | [Index](../../00-index.md) | [Next](../../Check.md)
<!-- NAV_TOP_END -->

# 39. 스펙 읽기

## 이전 챕터 점검 (01~38)
- [ ] 제네릭/리플렉션 선택 기준을 notes.md에 정리했다.

## 학습 목표
- 모호한 동작을 스펙 근거로 확인하는 습관을 만든다.

## 핵심 내용
- 메서드 셋
- 인터페이스 만족 조건
- 평가 순서 확인

## 예제 코드
```go
package main

import "fmt"

type A interface{ M() }

type S struct{}

func (S) M() {}

func use(a A) { fmt.Println("ok") }

func main() {
	var s S
	use(s)
}
```

## 실습
- 헷갈리는 규칙 3개를 스펙 링크와 함께 notes.md에 정리한다.

## 완료 기준
- [ ] 코드 동작 근거를 스펙으로 설명했다.
- [ ] 추측 대신 문서 근거를 남겼다.
- [ ] 팀 공유 가능한 메모를 작성했다.

<!-- NAV_BOTTOM_START -->
[Previous](../38_리플렉션/README.md) | [Index](../../00-index.md) | [Next](../../Check.md)
<!-- NAV_BOTTOM_END -->


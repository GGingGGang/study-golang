<!-- NAV_TOP_START -->
[Previous](../08_슬라이스/README.md) | [Index](../../00-index.md) | [Next](../10_구조체메서드/README.md)
<!-- NAV_TOP_END -->

# 09. 맵

## 이전 챕터 점검 (01~08)
- [ ] slice와 map의 참조적 성격을 이해한다.

## 학습 목표
- map의 조회, 초기화, 순회 규칙을 익힌다.

## 핵심 내용
- nil map은 읽기 가능/쓰기 불가
- `v, ok := m[k]`
- 순회 순서 비결정성

## 예제 코드
```go
package main

import "fmt"

func main() {
	m := map[string]int{"go": 2}
	v, ok := m["go"]
	fmt.Println(v, ok)

	v, ok = m["rust"]
	fmt.Println(v, ok)

	for k, n := range m {
		fmt.Println(k, n)
	}
}
```

## 실습
- 단어 빈도수 카운터와 테스트를 작성한다.

## 완료 기준
- [ ] ok 패턴을 모든 조회에 적용했다.
- [ ] 존재/미존재 케이스 테스트를 작성했다.

<!-- NAV_BOTTOM_START -->
[Previous](../08_슬라이스/README.md) | [Index](../../00-index.md) | [Next](../10_구조체메서드/README.md)
<!-- NAV_BOTTOM_END -->


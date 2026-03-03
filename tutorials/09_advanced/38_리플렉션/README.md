<!-- NAV_TOP_START -->
[Previous](../37_제네릭/README.md) | [Index](../../00-index.md) | [Next](../39_스펙읽기/README.md)
<!-- NAV_TOP_END -->

# 38. 리플렉션

## 이전 챕터 점검 (01~37)
- [ ] 37장에서 제네릭으로 중복 제거를 적용했다.

## 학습 목표
- 리플렉션을 필요한 범위에서만 제한적으로 사용한다.

## 핵심 내용
- `reflect.TypeOf`, `reflect.ValueOf`
- 런타임 타입 검사
- 성능/복잡도 비용

## 예제 코드
```go
package main

import (
	"fmt"
	"reflect"
)

func KindName(v any) string {
	return reflect.TypeOf(v).Kind().String()
}

func main() {
	fmt.Println(KindName(3))
	fmt.Println(KindName("go"))
}
```

## 실습
- 구조체 필드 검사 유틸 1개를 만들고 입력 범위를 제한한다.

## 완료 기준
- [ ] 리플렉션 사용 이유를 명시했다.
- [ ] 대체 가능한 경우(제네릭/인터페이스)를 검토했다.
- [ ] 과도한 동적 분기를 피했다.

<!-- NAV_BOTTOM_START -->
[Previous](../37_제네릭/README.md) | [Index](../../00-index.md) | [Next](../39_스펙읽기/README.md)
<!-- NAV_BOTTOM_END -->


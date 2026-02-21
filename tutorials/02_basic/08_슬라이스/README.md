# 08. 슬라이스

## 이전 챕터 점검 (01~07)
- [ ] 값/참조 특성과 함수 전달 규칙을 이해한다.

## 학습 목표
- 슬라이스의 len/cap/backing array를 이해한다.

## 핵심 내용
- `append` 재할당 가능성
- `copy`로 메모리 분리
- nil slice vs empty slice

## 예제 코드
```go
package main

import "fmt"

func main() {
	s := make([]int, 0, 2)
	s = append(s, 1, 2)
	p1 := &s[0]
	s = append(s, 3)
	p2 := &s[0]
	fmt.Println("same backing:", p1 == p2)

	a := []int{1, 2, 3}
	b := make([]int, len(a))
	copy(b, a)
	b[0] = 99
	fmt.Println(a, b)
}
```

## 실습
- 슬라이스를 함수에 넘길 때 발생하는 부작용 예제를 만든다.

## 완료 기준
- [ ] cap 변화 시점을 설명할 수 있다.
- [ ] copy를 써서 부작용을 제거했다.

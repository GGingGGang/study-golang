# 04. 타입과 변환

## 이전 챕터 점검 (01~03)
- [ ] 실행/빌드/테스트/포맷 흐름이 익숙하다.

## 학습 목표
- 기본 타입과 변환 규칙을 정확히 쓴다.

## 핵심 내용
- 정수/실수/문자열 타입
- 명시적 형변환
- 문자열 숫자 변환(`strconv`)

## 예제 코드
```go
package main

import (
	"fmt"
	"strconv"
)

func toInt(s string) (int, error) {
	return strconv.Atoi(s)
}

func main() {
	n, err := toInt("42")
	if err != nil {
		panic(err)
	}
	fmt.Println(n, float64(n)/10)
}
```

## 실습
- `toInt("x")` 실패 테스트를 작성한다.

## 완료 기준
- [ ] 변환 실패를 error로 처리한다.
- [ ] 성공/실패 테스트를 모두 작성했다.

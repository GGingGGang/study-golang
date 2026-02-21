# 16. 단위 테스트

## 이전 챕터 점검 (01~15)
- [ ] 15장 구조에서 `go test ./...`가 통과한다.
- [ ] 테스트 파일 위치를 일관되게 유지한다.

## 학습 목표
- 테이블 주도 테스트 패턴을 실전에 적용한다.

## 핵심 내용
- 케이스 목록을 구조체 슬라이스로 관리
- 입력/기대값/이름을 명시
- 실패 메시지에 케이스 이름 포함

## 예제 코드
```go
package calc

func Clamp(v, min, max int) int {
	if v < min {
		return min
	}
	if v > max {
		return max
	}
	return v
}
```

```go
package calc

import "testing"

func TestClamp(t *testing.T) {
	cases := []struct {
		name     string
		v, min, max int
		want     int
	}{
		{"below", -1, 0, 10, 0},
		{"middle", 5, 0, 10, 5},
		{"above", 99, 0, 10, 10},
	}

	for _, tc := range cases {
		t.Run(tc.name, func(t *testing.T) {
			if got := Clamp(tc.v, tc.min, tc.max); got != tc.want {
				t.Fatalf("want %d, got %d", tc.want, got)
			}
		})
	}
}
```

## 실습
- 경계값 3개 이상을 테이블로 추가
- 실패 메시지에 케이스 이름 포함

## 완료 기준
- [ ] 테이블 테스트를 작성했다.
- [ ] 경계값을 누락하지 않았다.
- [ ] 테스트 가독성이 유지된다.

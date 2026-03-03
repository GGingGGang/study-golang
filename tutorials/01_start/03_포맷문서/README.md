<!-- NAV_TOP_START -->
[Previous](../02_go도구/README.md) | [Index](../../00-index.md) | [Next](../../02_basic/04_타입변환/README.md)
<!-- NAV_TOP_END -->

# 03. 포맷과 문서

## 이전 챕터 점검 (01~02)
- [ ] 모듈 생성과 테스트 실행을 완료했다.
- [ ] 기본 명령 흐름을 알고 있다.

## 학습 목표
- gofmt를 기본 습관으로 고정한다.
- 공개 API 주석 규칙을 적용한다.

## 핵심 내용
- 포맷 표준: `gofmt -w .`
- 공개 심볼은 문서 주석을 붙인다.
- 주석은 "무엇을 하는지"를 짧게 설명한다.

## 예제 코드
```go
// Package mathx provides simple math helpers.
package mathx

// Max returns the larger value.
func Max(a, b int) int {
	if a > b {
		return a
	}
	return b
}
```

## 실습
1. 포맷이 깨진 파일을 만든다.
2. `gofmt` 적용 전/후를 비교한다.
3. 공개 함수 3개에 주석을 추가한다.

## 완료 기준
- [ ] 저장 시 자동 포맷 설정을 완료했다.
- [ ] 공개 함수 주석 3개 이상 작성했다.

<!-- NAV_BOTTOM_START -->
[Previous](../02_go도구/README.md) | [Index](../../00-index.md) | [Next](../../02_basic/04_타입변환/README.md)
<!-- NAV_BOTTOM_END -->


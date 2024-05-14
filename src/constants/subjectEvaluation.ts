import { EQualityValue, IQualityEvaluation } from '@domain/subject/subjectEvaluation'

export const OPTIONS_QUALITY_VALUE = Object.values(EQualityValue).map((value) => ({ value, label: value }))

export const EVALUATION_QUALITY: { key: keyof IQualityEvaluation; label: string }[] = [
  {
    key: 'focused_right_topic',
    label: 'Nội dung bài giảng và các thông tin tập trung vào đúng chủ đề',
  },
  {
    key: 'practical_content',
    label: 'Bài giảng được xây dựng với nội dung thực tiễn.',
  },
  {
    key: 'benefit_in_life',
    label: 'Bài giảng giúp bạn có thêm định hướng và những giải pháp của cá nhân trong cuộc sống',
  },
  {
    key: 'duration',
    label: 'Thời lượng bài giảng phù hợp',
  },
  {
    key: 'method',
    label: 'Phương pháp trình bày bài giảng trực quan, sinh động.',
  },
]

export const EVALUATION_NAME = new Map<string, string>([
  ['quality', 'Chất lượng bài giảng'],
  ['feedback_admin', 'Ý kiến HV nhắn gửi BTC để góp phần cải thiện chất lượng lớp học ở các buổi học tiếp theo (MC, các hoạt động,...)'],
  ['most_resonated', 'Hãy nêu điều làm bạn tâm đắc nhất trong buổi học.'],
  ['invited', 'Từ những điều tâm đắc trên, bạn được mời gọi làm gì?'],
  ['satisfied', 'Mức độ hài lòng chung của bạn đối với lớp học hôm nay?'],
  ['feedback_lecturer', 'Mời bạn gửi đến giảng viên những tâm tình/chia sẻ của mình tại đây nhé:'],
])

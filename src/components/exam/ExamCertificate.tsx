import { ExamResult } from '@/hooks/useExamTest';
import CertificateGenerator, { CertificateData } from '@/components/CertificateGenerator';

interface ExamCertificateProps {
  result: ExamResult;
  onClose: () => void;
}

const ExamCertificate = ({ result, onClose }: ExamCertificateProps) => {
  const certificateData: CertificateData = {
    name: result.certificate?.name || 'Candidate',
    testType: `${result.examTitle} Typing Test`,
    wpm: result.wpm,
    accuracy: result.accuracy,
    grade: result.certificate?.grade,
    score: result.certificate?.score,
    date: new Date(result.date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }),
  };

  return <CertificateGenerator data={certificateData} onClose={onClose} />;
};

export default ExamCertificate;

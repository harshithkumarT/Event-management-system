import toast from 'react-hot-toast';
import { downloadRevenueReport } from '../../services/admin';
import { PageHeader } from '../../components/common/PageHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

export default function RevenueReportsPage() {
  const handleDownload = async () => {
    const response = await downloadRevenueReport();
    const blob = new Blob([response.data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'revenue-report.pdf';
    link.click();
    window.URL.revokeObjectURL(url);
    toast.success('Report downloaded');
  };

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Reports" title="Revenue export" description="Download a PDF report for finance and stakeholders." />
      <Card className="max-w-xl">
        <Button onClick={handleDownload}>Download PDF report</Button>
      </Card>
    </div>
  );
}
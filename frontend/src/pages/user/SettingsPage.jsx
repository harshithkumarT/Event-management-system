import { useTheme } from '../../context/ThemeContext';
import { PageHeader } from '../../components/common/PageHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div>
      <PageHeader eyebrow="Settings" title="Preferences" description="Control your visual theme and account settings." />
      <Card className="max-w-xl space-y-4">
        <p className="text-slate-300">Current theme: <span className="text-white">{theme}</span></p>
        <Button variant="secondary" onClick={toggleTheme}>Toggle theme</Button>
      </Card>
    </div>
  );
}
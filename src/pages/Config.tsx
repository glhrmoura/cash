import Header from '@/components/Header';
import { ConfigPage as ConfigSettings } from '@/components/config';
import { useSettings } from '@/hooks/use-settings';

const Config = () => {
  const { settings, setPrimary, setLanguage } = useSettings();

  return (
    <div className="min-h-dvh bg-background">
      <Header />
      <ConfigSettings
        primary={settings.primary}
        language={settings.language}
        onPrimaryChange={setPrimary}
        onLanguageChange={setLanguage}
      />
    </div>
  );
};

export default Config;

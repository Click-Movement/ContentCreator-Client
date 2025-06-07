import React from 'react';
import { motion } from 'framer-motion';
import SettingCard from '../SettingCard';
import InputWithIcon from '../InputWithIcon';
import SelectWithIcon from '../SelectWithIcon';
import ToggleItem from '../toggle-item';
import { Globe, FileText, Settings, Mail, Clock, Languages, Coins } from 'lucide-react';

type GeneralTabProps = {
  containerVariants: any;
  itemVariants: any;
  saveStatus: Record<string, boolean>;
  handleSave: (section: string) => void;
};

export default function GeneralTab({ 
  containerVariants, 
  itemVariants, 
  saveStatus, 
  handleSave 
}: GeneralTabProps) {
  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-2 gap-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <SettingCard
        title="Platform Settings"
        description="Configure general platform settings"
        icon={Globe}
        color="blue"
        lastUpdated="June 7, 2025"
        onSave={() => handleSave('platform')}
        isSaved={saveStatus['platform']}
        variants={itemVariants}
      >
        <div className="space-y-5">
          <InputWithIcon
            id="platform-name"
            label="Platform Name"
            placeholder="Content Creator"
            defaultValue="Content Creator"
            color="blue"
          />
          
          <InputWithIcon
            id="platform-url"
            label="Platform URL"
            placeholder="https://contentcreator.app"
            defaultValue="https://contentcreator.app"
            color="blue"
          />
          
          <InputWithIcon
            id="support-email"
            label="Support Email"
            placeholder="support@contentcreator.app"
            defaultValue="support@contentcreator.app"
            icon={Mail}
            color="blue"
          />
          
          <SelectWithIcon
            id="timezone"
            label="Default Timezone"
            defaultValue="UTC"
            options={[
              { value: "UTC", label: "UTC" },
              { value: "EST", label: "Eastern Time (EST)" },
              { value: "CST", label: "Central Time (CST)" },
              { value: "MST", label: "Mountain Time (MST)" },
              { value: "PST", label: "Pacific Time (PST)" }
            ]}
            icon={Clock}
            color="blue"
          />
          
          <ToggleItem
            id="maintenance-mode"
            label="Maintenance Mode"
            description="Enable maintenance mode to prevent users from accessing the platform"
            color="blue"
          />
        </div>
      </SettingCard>
      
      <SettingCard
        title="Default Content Settings"
        description="Configure default settings for content generation"
        icon={FileText}
        color="purple"
        lastUpdated="June 5, 2025"
        onSave={() => handleSave('content')}
        isSaved={saveStatus['content']}
        variants={itemVariants}
      >
        <div className="space-y-5">
          <SelectWithIcon
            id="default-language"
            label="Default Language"
            defaultValue="en"
            options={[
              { value: "en", label: "English" },
              { value: "es", label: "Spanish" },
              { value: "fr", label: "French" },
              { value: "de", label: "German" },
              { value: "zh", label: "Chinese" }
            ]}
            icon={Languages}
            color="purple"
          />
          
          <InputWithIcon
            id="default-credits"
            label="Default Credits for New Users"
            placeholder="1000"
            defaultValue="1000"
            type="number"
            icon={Coins}
            color="purple"
            description="Credits allocated to newly registered users"
          />
          
          <SelectWithIcon
            id="output-length"
            label="Default Output Length"
            defaultValue="medium"
            options={[
              { value: "short", label: "Short (300 words)" },
              { value: "medium", label: "Medium (600 words)" },
              { value: "long", label: "Long (1000 words)" },
              { value: "xlarge", label: "Extra Long (1500+ words)" }
            ]}
            color="purple"
          />

          <SelectWithIcon
            id="tone"
            label="Default Content Tone"
            defaultValue="professional"
            options={[
              { value: "professional", label: "Professional" },
              { value: "casual", label: "Casual" },
              { value: "friendly", label: "Friendly" },
              { value: "authoritative", label: "Authoritative" },
              { value: "persuasive", label: "Persuasive" }
            ]}
            color="purple"
          />
        </div>
      </SettingCard>

      <SettingCard
        title="Advanced Settings"
        description="Fine-tune platform behavior and performance"
        icon={Settings}
        color="green"
        lastUpdated="June 3, 2025"
        onSave={() => handleSave('advanced')}
        isSaved={saveStatus['advanced']}
        variants={itemVariants}
        className="md:col-span-2"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-5">
            <ToggleItem
              id="auto-save"
              label="Auto-Save Content"
              description="Automatically save content drafts every 5 minutes"
              color="green"
              defaultChecked={true}
            />

            <ToggleItem
              id="analytics"
              label="Usage Analytics"
              description="Collect anonymous usage data to improve the platform"
              color="green"
              defaultChecked={true}
            />
          </div>

          <div className="space-y-5">
            <ToggleItem
              id="beta-features"
              label="Beta Features"
              description="Enable access to experimental features"
              color="green"
            />

            <ToggleItem
              id="caching"
              label="Content Caching"
              description="Cache generated content to improve performance"
              color="green"
              defaultChecked={true}
            />
          </div>
        </div>
      </SettingCard>
    </motion.div>
  );
}
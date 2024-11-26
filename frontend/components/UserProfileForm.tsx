import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { UserProfile } from '@/services/apiService'

interface Props {
  initialProfile: UserProfile | null;
  onSave: (profile: UserProfile) => void;
}

export default function UserProfileForm({ initialProfile, onSave }: Props) {
  const [profile, setProfile] = useState<UserProfile>(initialProfile || {
    age: 0,
    sex: '',
    weight: 0,
    height: 0,
    ethnicity: '',
    goal: '',
    activity_level: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(profile);
  };

  const handleChange = (key: keyof UserProfile, value: string | number) => {
    setProfile(prev => ({ ...prev, [key]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="age" className="block mb-2">Age:</label>
        <Input
          type="number"
          id="age"
          value={profile.age}
          onChange={(e) => handleChange('age', parseInt(e.target.value))}
          required
        />
      </div>
      <div>
        <label htmlFor="sex" className="block mb-2">Sex:</label>
        <Select onValueChange={(value) => handleChange('sex', value)} value={profile.sex}>
          <SelectTrigger>
            <SelectValue placeholder="Select sex" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="male">Male</SelectItem>
            <SelectItem value="female">Female</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <label htmlFor="weight" className="block mb-2">Weight (kg):</label>
        <Input
          type="number"
          id="weight"
          value={profile.weight}
          onChange={(e) => handleChange('weight', parseFloat(e.target.value))}
          required
        />
      </div>
      <div>
        <label htmlFor="height" className="block mb-2">Height (cm):</label>
        <Input
          type="number"
          id="height"
          value={profile.height}
          onChange={(e) => handleChange('height', parseInt(e.target.value))}
          required
        />
      </div>
      <div>
        <label htmlFor="ethnicity" className="block mb-2">Ethnicity:</label>
        <Input
          type="text"
          id="ethnicity"
          value={profile.ethnicity}
          onChange={(e) => handleChange('ethnicity', e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="goal" className="block mb-2">Goal:</label>
        <Input
          type="text"
          id="goal"
          value={profile.goal}
          onChange={(e) => handleChange('goal', e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="activity_level" className="block mb-2">Weekly Activity Level:</label>
        <Input
          type="text"
          id="activity_level"
          value={profile.activity_level}
          onChange={(e) => handleChange('activity_level', e.target.value)}
          placeholder="Describe your weekly activity level"
          required
        />
      </div>
      <Button type="submit">Save Profile</Button>
    </form>
  );
}


export interface FamilyMember {
  id: string;
  name: string;
  image?: string;
  role: 'father' | 'mother' | 'groom' | 'bride' | 'sibling';
}

export interface FamilyData {
  groom: {
    id: string;
    name: string;
    image?: string;
    father: FamilyMember;
    mother: FamilyMember;
    siblings: FamilyMember[];
  };
  bride: {
    id: string;
    name: string;
    image?: string;
    father: FamilyMember;
    mother: FamilyMember;
    siblings: FamilyMember[];
  };
}

export interface FamilyTreeProps {
  onSave?: (data: FamilyData) => Promise<void>;
  initialData?: Partial<FamilyData>;
  apiEndpoint?: string;
}
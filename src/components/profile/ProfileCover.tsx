
type ProfileCoverProps = {
  coverUrl: string | null;
};

export const ProfileCover = ({ coverUrl }: ProfileCoverProps) => {
  if (!coverUrl) return null;
  
  return (
    <div className="w-full h-48 relative">
      <img 
        src={coverUrl} 
        alt="Cover" 
        className="w-full h-full object-cover"
      />
    </div>
  );
};

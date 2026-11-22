import Image from 'next/image';
import { ExternalLink } from '@/components/ui/ExternalLink';
import { SocialIcon } from '@/components/ui/SocialIcon';
import type { Leader } from '@/content/team';

export function LeaderCard({ leader }: { leader: Leader }) {
  return (
    <div className="leader-card">
      <div className="leader-image">
        <Image
          src={leader.image}
          alt={`${leader.name}, ${leader.title}`}
          className="leader-avatar"
          sizes="300px"
          placeholder="blur"
        />
      </div>
      <div className="social-links profile-social">
        {leader.linkedin && (
          <ExternalLink href={leader.linkedin} title="LinkedIn" aria-label={`${leader.name} on LinkedIn`}>
            <SocialIcon network="linkedin" />
          </ExternalLink>
        )}
        {leader.instagram && (
          <ExternalLink href={leader.instagram} title="Instagram" aria-label={`${leader.name} on Instagram`}>
            <SocialIcon network="instagram" />
          </ExternalLink>
        )}
      </div>
      <div className="leader-info">
        <h3>{leader.name}</h3>
        <p className="leader-title">{leader.title}</p>
      </div>
    </div>
  );
}

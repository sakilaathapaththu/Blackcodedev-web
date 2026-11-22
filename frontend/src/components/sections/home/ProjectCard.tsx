import Image from 'next/image';
import { ExternalLink } from '@/components/ui/ExternalLink';
import { showLiveDemoLinks, type Project } from '@/content/home';

const imageStyle = { width: '100%', height: 'auto', borderRadius: '10px' } as const;

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="project-card">
      <div className="project-image">
        <Image
          src={project.image}
          alt={project.imageAlt}
          style={imageStyle}
          sizes="(max-width: 768px) 100vw, 400px"
          placeholder="blur"
        />
      </div>
      <div className="project-content">
        <div className="project-category">{project.category}</div>
        <h3 className="project-title">{project.title}</h3>
        <p className="project-description">{project.description}</p>
        <div className="project-tech">
          {project.tech.map((tag) => (
            <span key={tag} className="tech-tag">
              {tag}
            </span>
          ))}
        </div>
        <div className="project-links">
          {showLiveDemoLinks && project.liveUrl && (
            <ExternalLink href={project.liveUrl} className="project-link primary">
              Live Demo
            </ExternalLink>
          )}
        </div>
      </div>
    </article>
  );
}

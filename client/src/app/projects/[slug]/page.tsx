
import { PROJECTS_DATA } from '@/lib/projects';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ExternalLink, Github, CheckCircle } from 'lucide-react';
import { Button } from '@/components/Button';

interface ProjectPageProps {
    params: Promise<{
        slug: string;
    }>;
}

export async function generateStaticParams() {
    return PROJECTS_DATA.map((project) => ({
        slug: project.slug,
    }));
}

export default async function ProjectPage({ params }: ProjectPageProps) {
    const { slug } = await params;

    // Find the project data
    const project = PROJECTS_DATA.find((item) => item.slug === slug);

    if (!project) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-background pt-24 pb-20">
            <div className="container px-4 mx-auto max-w-5xl">
                <Link
                    href="/#projects"
                    className="inline-flex items-center text-muted-foreground hover:text-primary mb-8 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Quay lại danh sách dự án
                </Link>

                <div className="grid md:grid-cols-2 gap-10">
                    {/* Left Column: Image */}
                    <div>
                        <div className="aspect-[4/3] relative rounded-2xl overflow-hidden shadow-2xl bg-muted">
                            <Image
                                src={project.image}
                                alt={project.title}
                                fill
                                className="object-cover"
                            />
                        </div>
                    </div>

                    {/* Right Column: Info */}
                    <div className="space-y-6">
                        <div>
                            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary mb-4">
                                Student Showcase
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold mb-2 text-foreground">
                                {project.title}
                            </h1>
                            <p className="text-lg font-medium text-muted-foreground">
                                Thực hiện bởi: <span className="text-foreground">{project.student}</span>
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {project.tech.map((tech, i) => (
                                <span
                                    key={i}
                                    className="px-3 py-1 bg-secondary text-secondary-foreground rounded-md text-sm font-medium"
                                >
                                    {tech}
                                </span>
                            ))}
                        </div>

                        <div className="prose dark:prose-invert max-w-none text-muted-foreground">
                            <p>{project.content}</p>
                        </div>

                        <div className="space-y-3">
                            <h3 className="font-semibold text-foreground text-lg">Tính năng nổi bật</h3>
                            <ul className="space-y-2">
                                {project.features?.map((feature, idx) => (
                                    <li key={idx} className="flex items-start gap-2 text-muted-foreground">
                                        <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="flex gap-4 pt-4">
                            <Button className="gap-2">
                                <ExternalLink className="w-4 h-4" />
                                Xem Demo
                            </Button>
                            <Button variant="outline" className="gap-2">
                                <Github className="w-4 h-4" />
                                Source Code
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

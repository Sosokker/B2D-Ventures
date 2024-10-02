"use client";

import { useSearchParams } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase URL and Key must be provided');
}
const supabase = createClient(supabaseUrl, supabaseKey);

interface ProjectInvestmentDetail {
    minInvestment: number;
    totalInvestment: number;
    targetInvestment: number;
}

interface Project {
    id: string;
    projectName: string;
    businessId: string;
    investmentCount: number;
    ProjectInvestmentDetail: ProjectInvestmentDetail[];
    tags: string[];
}

interface Business {
    id: string;
    businessName: string;
    joinedDate: string;
    Projects: Project[];
}

export default function Find() {
    const searchParams = useSearchParams();
    const query = searchParams.get('query');
    const [results, setResults] = useState<Business[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);

            // fetch businesses
            const { data: businesses, error: businessError } = await supabase
                .from('Business')
                .select('id, businessName, joinedDate')
                .ilike('businessName', `%${query}%`);

            if (businessError) {
                console.error('Error fetching businesses:', businessError);
                setLoading(false);
                return;
            }

            // fetch projects for these businesses
            const { data: projects, error: projectError } = await supabase
                .from('Project')
                .select(`
                    id,
                    projectName,
                    businessId,
                    ProjectInvestmentDetail (
                        minInvestment,
                        totalInvestment,
                        targetInvestment
                    )
                `)
                .in('businessId', businesses?.map(b => b.id) || []);

            if (projectError) {
                console.error('Error fetching projects:', projectError);
                setLoading(false);
                return;
            }

            // fetch tags for these projects
            const { data: tags, error: tagError } = await supabase
                .from('ItemTag')
                .select('itemId, Tag (value)')
                .in('itemId', projects?.map(p => p.id) || []);

            if (tagError) {
                console.error('Error fetching tags:', tagError);
            }

            // fetch investment counts
            const { data: investmentCounts, error: investmentError } = await supabase
                .from('InvestmentDeal')
                .select('projectId, count', { count: 'exact', head: false })
                .in('projectId', projects?.map(p => p.id) || []);

            if (investmentError) {
                console.error('Error fetching investment counts:', investmentError);
            }

            // combine all data
            const processedResults = businesses?.map(business => ({
                ...business,
                Projects: projects
                    ?.filter(project => project.businessId === business.id)
                    .map(project => ({
                        ...project,
                        tags: tags
                            ?.filter(t => t.itemId === project.id)
                            .map(t => t.Tag.values as unknown as string) || [],
                        investmentCount: investmentCounts?.find(ic => ic.projectId === project.id)?.count || 0
                    })) || []
            })) || [];

            setResults(processedResults);
            setLoading(false);
        };

        if (query) {
            fetchData();
        }
    }, [query]);

    return (
        <div>
            {loading && <p>Loading...</p>}
            {!loading && results.length === 0 && <p>No results found.</p>}
            {!loading && results.length > 0 && (
                <ul>
                    {results.map(business => (
                        <li key={business.id}>
                            <h2>{business.businessName}</h2>
                            <p>Joined Date: {new Date(business.joinedDate).toLocaleDateString()}</p>
                            <ul>
                                {business.Projects.map((project) => (
                                    <li key={project.id}>
                                        <h3>{project.projectName}</h3>
                                        <p>Investment Count: {project.investmentCount}</p>
                                        <p>Min Investment: ${project.ProjectInvestmentDetail[0]?.minInvestment}</p>
                                        <p>Total Investment: ${project.ProjectInvestmentDetail[0]?.totalInvestment}</p>
                                        <p>Target Investment: ${project.ProjectInvestmentDetail[0]?.targetInvestment}</p>
                                        <p>Tags: {project.tags.join(', ')}</p>
                                    </li>
                                ))}
                            </ul>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
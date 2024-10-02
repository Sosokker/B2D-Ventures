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

export default function Find(){
    const searchParams = useSearchParams();
    const query = searchParams.get('query');
    const [result, setResult] = useState<{ businessName: string }[] | "">("");

    useEffect(() => {
        if (query) {
            getQuery(query);
        }
      }, [query]);
      const getQuery = async (query: string) => {
        console.log('Query is: ', query);
      
        // search for relevant Business names first
        let { data: businessData, error: businessError } = await supabase
          .from('Business')
          .select('id, businessName') 
          .ilike('businessName', `%${query}%`);
      
        if (businessError) {
          console.error('Error fetching businesses:', businessError);
          return;
        }
      
        console.log('Business Search Results:', businessData);
      
        // then search for relevant Project names
        let { data: projectData, error: projectError } = await supabase
          .from('Projects')
          .select('id, projectName')
          .ilike('projectName', `%${query}%`);
      
        if (projectError) {
          console.error('Error fetching projects:', projectError);
          return;
        }
      
        console.log('Project Search Results:', projectData);
      
        return {
          businesses: businessData,
          projects: projectData,
        };
      };
      
    return (
        <div>
            <div className='ml-10 md:ml-48 mt-10'>
                <h1 className='font-bold text-lg md:text-2xl'>You searched for "{query}"</h1>
                {Array.isArray(result) ? (
                    result.map((item, index) => (
                        <div key={index}>{item.businessName}</div>
                    ))
                ) : (
                    result
                )}
            </div>
        </div>
    );
}
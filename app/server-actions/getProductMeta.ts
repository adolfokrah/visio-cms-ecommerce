import { createClient } from "@/utils/supabase/server"

export default async function getProductMeta(id:string){
    const supabase = createClient();
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

    if (error || !data) return null

    return {
        title: data.name,
        description: data.description,
        keywords: data.name,
        featuredImage: data.photos?.[0].src
    }
}
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  const { category } = params;    
  
 
  try {
    // Fetch categories based on the "type" parameter
    const categories = await prisma.subcategory.findMany({
      where: { category:category },
    });

    if (!categories || categories.length === 0) {
      return new Response(JSON.stringify({ message: 'No item found for the specified category.' }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(categories), { status: 200 });
  } catch (error) {
    console.error('Error fetching category:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}

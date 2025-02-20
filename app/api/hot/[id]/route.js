import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Update Product API
export async function PATCH(request, { params }) {
  const { id } = params;

  console.log("id", id);
  
  const {
    title,  
  } = await request.json();

  try {
    // Update product and its specifications
    const updatedProduct = await prisma.title.update({
      where: { id },
      data: {
        title
      },
    });

    return new Response(JSON.stringify(updatedProduct), { status: 200 });
  } catch (error) {
    console.error('Error updating product:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to update product' }),
      { status: 500 }
    );
  }
}

 

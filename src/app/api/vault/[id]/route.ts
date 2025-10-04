import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { getCurrentUser } from '@/lib/auth';
import { VaultItem } from '@/types';
import { ObjectId } from 'mongodb';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { id } = await params;
    const { title, username, password, url, notes } = await request.json();
    
    if (!title || !username || !password) {
      return NextResponse.json(
        { error: 'Title, username, and password are required' },
        { status: 400 }
      );
    }
    
    const { db } = await connectToDatabase();
    const vaultItems = db.collection<VaultItem>('vaultItems');
    
    const updateData = {
      title,
      username,
      password, // This should be encrypted on the client side
      url: url || '',
      notes: notes || '',
      updatedAt: new Date(),
    };
    
    const result = await vaultItems.updateOne(
      { _id: new ObjectId(id), userId: user.userId },
      { $set: updateData }
    );
    
    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Vault item not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      message: 'Vault item updated successfully'
    });
  } catch (error) {
    console.error('Error updating vault item:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { id } = await params;
    const { db } = await connectToDatabase();
    const vaultItems = db.collection<VaultItem>('vaultItems');
    
    const result = await vaultItems.deleteOne({
      _id: new ObjectId(id),
      userId: user.userId
    });
    
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Vault item not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      message: 'Vault item deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting vault item:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

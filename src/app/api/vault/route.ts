import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { getCurrentUser } from '@/lib/auth';
import { VaultItem } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const user = getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { db } = await connectToDatabase();
    const vaultItems = db.collection<VaultItem>('vaultItems');
    
    const items = await vaultItems
      .find({ userId: user.userId })
      .sort({ createdAt: -1 })
      .toArray();
    
    return NextResponse.json({ items });
  } catch (error) {
    console.error('Error fetching vault items:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { title, username, password, url, notes } = await request.json();
    
    if (!title || !username || !password) {
      return NextResponse.json(
        { error: 'Title, username, and password are required' },
        { status: 400 }
      );
    }
    
    const { db } = await connectToDatabase();
    const vaultItems = db.collection<VaultItem>('vaultItems');
    
    const vaultItem: Omit<VaultItem, '_id'> = {
      userId: user.userId,
      title,
      username,
      password, // This should be encrypted on the client side before sending
      url: url || '',
      notes: notes || '',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    const result = await vaultItems.insertOne(vaultItem);
    
    return NextResponse.json({
      message: 'Vault item created successfully',
      item: { ...vaultItem, _id: result.insertedId }
    });
  } catch (error) {
    console.error('Error creating vault item:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

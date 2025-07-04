import { useState } from 'react';

type Friend = {
  id: number | string;
  name: string;
  image: string;
  balance: number;
};

const initialFriends: Friend[] = [
  {
    id: 118836,
    name: 'Kirit',
    image: 'https://i.pravatar.cc/48?u=118836',
    balance: -7,
  },
  {
    id: 933372,
    name: 'Sujal',
    image: 'https://i.pravatar.cc/48',
    balance: 20,
  },
  {
    id: 499476,
    name: 'Saahil',
    image: 'https://i.pravatar.cc/48?u=499476',
    balance: 0,
  },
];

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
};


function Button({ children, onClick }: ButtonProps) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}


export default function App() {
  const [friends, setFriends] = useState<Friend[]>(initialFriends);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);

  function handleShowAddFriend() {
    setShowAddFriend((show) => !show);
  }

  function handleAddFriend(friend: Friend) {
    setFriends((friends) => [...friends, friend]);
    setShowAddFriend(false);
  }

  function handleSelection(friend: Friend) {
    setSelectedFriend((cur) => (cur?.id === friend.id ? null : friend));
    setShowAddFriend(false);
  }

  function handleSplitBill(value: number) {
    setFriends((friends) =>
      friends.map((friend) =>
        friend.id === selectedFriend?.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
    setSelectedFriend(null);
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendList
          friends={friends}
          selectedFriend={selectedFriend}
          onSelection={handleSelection}
        />

        {showAddFriend && <FormAddFriend onAddFriend={handleAddFriend} />}

        <Button onClick={handleShowAddFriend}>
          {showAddFriend ? 'Close' : 'Add friend'}
        </Button>
      </div>

      {selectedFriend && (
        <FormSplitBill
          selectedFriend={selectedFriend}
          onSplitBill={handleSplitBill}
        />
      )}
    </div>
  );
}

type FriendListProps = {
  friends: Friend[];
  onSelection: (friend: Friend) => void;
  selectedFriend: Friend | null;
};

function FriendList({ friends, onSelection, selectedFriend }: FriendListProps) {
  return (
    <div>
      {friends.map((friend) => (
        <FriendItem
          friend={friend}
          key={friend.id}
          onSelection={onSelection}
          selectedFriend={selectedFriend}
        />
      ))}
    </div>
  );
}

type FriendItemProps = {
  friend: Friend;
  onSelection: (friend: Friend) => void;
  selectedFriend: Friend | null;
};

function FriendItem({ friend, onSelection, selectedFriend }: FriendItemProps) {
  const isSelected = selectedFriend?.id === friend.id;
  return (
    <div className={isSelected ? 'selected' : ''}>
      <li>
        <img src={friend.image} alt={friend.name} />
        <h3>{friend.name}</h3>
        {friend.balance < 0 && (
          <p className="red">
            You owe {friend.name} {Math.abs(friend.balance)}$
          </p>
        )}
        {friend.balance > 0 && (
          <p className="green">
            {friend.name} owes you {Math.abs(friend.balance)}$
          </p>
        )}
        {friend.balance === 0 && <p>You and {friend.name} are even</p>}

        <Button onClick={() => onSelection(friend)}>
          {isSelected ? 'close' : 'select'}
        </Button>
      </li>
    </div>
  );
}

type FormAddFriendProps = {
  onAddFriend: (friend: Friend) => void;
};

function FormAddFriend({ onAddFriend }: FormAddFriendProps) {
  const [name, setName] = useState('');
  const [image, setImage] = useState('https://i.pravatar.cc/48');

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!name || !image) return;

    const id = crypto.randomUUID();
    const newFriend: Friend = {
      id,
      name,
      image: `${image}?=${id}`,
      balance: 0,
    };

    onAddFriend(newFriend);

    setName('');
    setImage('https://i.pravatar.cc/48');
  }

  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>👭 Friend name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <label>🌄 Image URL</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />

      <Button>Add</Button>
    </form>
  );
}

type FormSplitBillProps = {
  selectedFriend: Friend;
  onSplitBill: (value: number) => void;
};

function FormSplitBill({ selectedFriend, onSplitBill }: FormSplitBillProps) {
  const [bill, setBill] = useState<number>(0);
  const [paidByUser, setPaidByUser] = useState<number>(0);
  const PaidByFriend = bill - paidByUser;

  const [whoPaying, setWhoPaying] = useState<'user' | 'friend'>('user');

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (bill === 0 || paidByUser === 0) return;

    onSplitBill(whoPaying === 'user' ? PaidByFriend : -paidByUser);
  }

  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Split a bill with {selectedFriend.name}</h2>

      <label>💰Bill value</label>
      <input
        type="number"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      />

      <label>🧔🏽Your expenses</label>
      <input
        type="number"
        value={paidByUser}
        onChange={(e) =>
          setPaidByUser(
            Number(e.target.value) > bill
              ? paidByUser
              : Number(e.target.value)
          )
        }
      />

      <label>👭{selectedFriend.name}'s expenses</label>
      <input type="text" disabled value={PaidByFriend} />

      <label>🤑Who's paying?</label>
      <select
        value={whoPaying}
        onChange={(e) => setWhoPaying(e.target.value as 'user' | 'friend')}
      >
        <option value="user">You</option>
        <option value="friend">{selectedFriend.name}</option>
      </select>

      <Button>Split bill</Button> 

    </form>
  );
}

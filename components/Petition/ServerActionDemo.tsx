'use client';

import { useState } from 'react';

export default function ServerActionDemo() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <div>Count: {count}</div>
      <button>Action</button>
    </div>
  );
}

import React, {useEffect} from 'react';
import {TagContainer} from "@pages/content/ui/components";

export default function App({textarea}: { textarea: HTMLTextAreaElement }) {
  useEffect(() => {
    console.log('content view loaded');
  }, []);

  return <TagContainer textarea={textarea}/>;
}

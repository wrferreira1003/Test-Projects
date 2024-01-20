import SocialProfile from 'views/apps/user/social-profile';

// ==============================|| PAGE ||============================== //

type Props = {
  params: {
    tabs: string;
  };
};

// Multiple versions of this page will be statically generated
// using the `params` returned by `generateStaticParams`
export default function Page({ params }: Props) {
  const { tabs } = params;

  return <SocialProfile tab={tabs} />;
}

// Return a list of `params` to populate the [slug] dynamic segment
export async function generateStaticParams() {
  const response = ['posts', 'follower', 'friends', 'gallery', 'friend-request'];

  return response.map((tab: string) => ({
    tab: tab
  }));
}

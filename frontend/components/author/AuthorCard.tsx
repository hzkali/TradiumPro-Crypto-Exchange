import Link from "next/link";
import { Avatar } from "../helpers/Avatar.component";

export default function AuthorCard({ user }: any) {
  return (
    <>
      <div className="single-author text-center">
        <div className="author-thumbnail">
          <Link href={`collectors/${user.walletAddress}`}>
            <a>
              <Avatar
                url={user.avatar}
                email={user.email}
                name={user.name}
                size={200}
              />
            </a>
          </Link>
        </div>
        <div className="author-info">
          <h3 className="author-name">
            <Link href={`collectors/${user.walletAddress}`}>{user.name}</Link>
          </h3>
          <h4 className="author-id">@{user.username}</h4>
          <h4 className="author-amount">
            {user.ownedItems ? user.ownedItems.length : 0} Items
          </h4>
        </div>
      </div>
    </>
  );
}

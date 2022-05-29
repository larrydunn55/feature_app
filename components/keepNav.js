import Link from 'next/link'
import 'bootstrap/dist/css/bootstrap.min.css';

const Nav = () => {
  return (
    <div className="h-25 p-3 text-light bg-dark">
      <nav>
        <Link href="/ssg">
          <a>DAM</a>
          <Link href="https://content.admin.amuniversal.com/metadata/features">
            <a>Feature</a>
          </Link>
        </Link>
        <Link href="https://content.admin.amuniversal.com/metadata/features">
          <a>Feature</a>
        </Link>
        <Link href="https://content.admin.amuniversal.com/metadata/review">
          <a>Review</a>
        </Link>
        <Link href="https://content.admin.amuniversal.com/metadata/user_list">
          <a>User List</a>
        </Link>
        <Link href="https://content.admin.amuniversal.com/users/sign_out">
          <a>Sign out</a>
        </Link>
        <style jsx>
          {`
          a {
            margin-right: 25px;
          }
        `}
        </style>
      </nav>
    </div>
  )
}

export default Nav

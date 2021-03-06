import cx from 'classnames';
import data from 'data/searchindex.json';
import { useRouter } from 'next/router';

import CommunityLinks from 'components/CommunityLinks';
import { ArrowDown, Book, Code, Community, Cog, File } from './Icons';

import { contents as CONTENTS } from './contents.json';
import subTree from './subTree';

const API_DOCS_PAGES = [];

const docnames = data.docnames;
for (const i in docnames) {
  const doc = docnames[i];
  const title = data.titles[i];
  if (doc.includes('sections')) {
    API_DOCS_PAGES.push({
      name: title,
      path: doc.replace('sections/api/apidocs/', '/'),
    });
  }
}

export type TreeElement = {
  name: string;
  path: string;
  isAbsolutePath?: boolean;
};

const SUBTREE = subTree(API_DOCS_PAGES as TreeElement[]);

type MainItemProps = {
  name: string;
  path: string;
  icon?: JSX.Element;
};

const MainItem: React.FC<MainItemProps> = ({ name, path, icon }) => {
  const router = useRouter();
  const selected = router.pathname.includes(path);
  return (
    <a
      href={selected ? '#' : path}
      className={cx(
        'group flex items-center px-2 py-2 text-sm leading-5 font-medium text-gray-900 rounded-md',
        { 'bg-gray-100': selected },
        { 'hover:text-gray-900': !selected },
        { 'hover:bg-gray-100': !selected },
        { 'focus:outline-none': !selected },
        { 'focus:bg-gray-200': !selected },
        'transition ease-in-out duration-150',
      )}
    >
      {icon}
      {/* <svg
        className="mr-3 h-6 w-6 text-gray-500 group-hover:text-gray-500 group-focus:text-gray-600 transition ease-in-out duration-150"
        stroke="currentColor"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M3 12l9-9 9 9M5 10v10a1 1 0 001 1h3a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1h3a1 1 0 001-1V10M9 21h6"
        />
      </svg> */}
      <span className="truncate">{name}</span>
    </a>
  );
};

type NavProps = {
  className: string;
  isMobile?: boolean;
};

const IconClassName =
  'mr-3 h-6 w-6 text-gray-500 group-hover:text-gray-500 group-focus:text-gray-600 transition ease-in-out duration-150';

const Nav: React.FC<NavProps> = ({ className, isMobile }) => {
  const router = useRouter();
  const selectedSection = CONTENTS.find((i) =>
    router.pathname.includes(i.path),
  );
  return (
    <nav className={className}>
      {isMobile && <CommunityLinks className="mb-5" />}
      <div>
        <MainItem
          name={'Install'}
          path="/docs/install"
          icon={<ArrowDown className={IconClassName} />}
        />
        <MainItem
          name={'Tutorial'}
          path="/docs/tutorial"
          icon={<File className={IconClassName} />}
        />
        <MainItem
          name={'Learn'}
          path="/docs/learn"
          icon={<Book className={IconClassName} />}
        />
        <MainItem
          name={'API Docs'}
          path="/docs/apidocs"
          icon={<Code className={IconClassName} />}
        />
        <MainItem
          name={'Deploying'}
          path="/docs/deploying"
          icon={<Cog className={IconClassName} />}
        />
        <MainItem
          name={'Community'}
          path="/docs/community"
          icon={<Community className={IconClassName} />}
        />
      </div>

      {selectedSection &&
      SUBTREE[selectedSection.name] &&
      SUBTREE[selectedSection.name].length > 0 ? (
        <div className="mt-8">
          <h3 className="px-3 text-xs leading-4 font-semibold text-gray-500 uppercase tracking-wider">
            {selectedSection?.name}
          </h3>
          <div className="mt-1">
            {selectedSection?.name &&
              SUBTREE[selectedSection.name] &&
              SUBTREE[selectedSection.name].map((i: any, idx) => {
                let subsectionPath = '';
                let subSelected = false;

                if (i.isAbsolutePath === true) {
                  subsectionPath = i.path;
                } else {
                  subsectionPath = selectedSection.path + i.path;
                  if (router.pathname.includes(subsectionPath)) {
                    subSelected = true;
                  }
                  // Handle dynamic docs
                  if (
                    router.query.page instanceof Array &&
                    '/' + router.query.page.join('/') === i.path
                  ) {
                    subSelected = true;
                  }
                }

                return (
                  <a
                    key={idx}
                    href={subsectionPath}
                    className={`group flex items-center px-3 py-2 text-sm leading-5 font-medium text-gray-600 ${
                      subSelected && 'bg-blue-100'
                    } rounded-md hover:text-gray-900 hover:bg-gray-50 focus:outline-none focus:bg-gray-100 transition ease-in-out duration-150`}
                  >
                    <span className="truncate">{i.name}</span>
                  </a>
                );
              })}
          </div>
        </div>
      ) : null}
    </nav>
  );
};

export default Nav;

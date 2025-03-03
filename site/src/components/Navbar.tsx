import {
  VFC,
  useState,
  useEffect,
  Fragment,
  useContext,
  SetStateAction,
  Dispatch,
  useMemo,
} from "react";
import {
  Box,
  Typography,
  Icon,
  Container,
  useTheme,
  useMediaQuery,
  IconButton,
  Slide,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Divider,
  useScrollTrigger,
  Breadcrumbs,
} from "@mui/material";
import { useRouter } from "next/router";
import { SiteMapPage, SiteMapPageSection } from "../lib/sitemap";
import { Button } from "./Button";
import { Link } from "./Link";
import { BlockProtocolLogoIcon } from "./SvgIcon/BlockProtocolLogoIcon";
import { BlockHubIcon } from "./SvgIcon/BlockHubIcon";
import { SpecificationIcon } from "./SvgIcon/SpecificationIcon";
import { BoltIcon } from "./SvgIcon/BoltIcon";
import { HOME_PAGE_HEADER_HEIGHT } from "../pages/index.page";
import SiteMapContext from "./context/SiteMapContext";

export const DESKTOP_NAVBAR_HEIGHT = 71.5;

export const MOBILE_NAVBAR_HEIGHT = 57;

const BREAD_CRUMBS_HEIGHT = 36;

const IDLE_NAVBAR_TIMEOUT_MS = 3000;

const NAVBAR_LINK_ICONS: Record<string, JSX.Element> = {
  "Block Hub": (
    <BlockHubIcon
      sx={{
        width: 18,
        height: 18,
      }}
    />
  ),
  Documentation: (
    <Icon
      className="fas fa-book-open"
      sx={{
        fontSize: 18,
      }}
      fontSize="inherit"
    />
  ),
  Specification: (
    <SpecificationIcon
      sx={{
        width: 18,
        height: 18,
      }}
    />
  ),
};

const itemIsPage = (
  item: SiteMapPage | SiteMapPageSection,
): item is SiteMapPage => "href" in item;

type MobileBreadcrumbsProps = {
  crumbs: (SiteMapPage | SiteMapPageSection)[];
};

const findCrumbs = (params: {
  asPath: string;
  item: SiteMapPage | SiteMapPageSection;
  parents?: (SiteMapPage | SiteMapPageSection)[];
  parentHref?: string;
}): (SiteMapPage | SiteMapPageSection)[] | null => {
  const { parents, item, asPath, parentHref } = params;

  for (const section of itemIsPage(item) ? item.sections : item.subSections) {
    const crumbs = findCrumbs({
      asPath,
      item: section,
      parents: [...(parents || []), item],
      parentHref: itemIsPage(item) ? item.href : parentHref,
    });

    if (crumbs) {
      return crumbs;
    }
  }

  if (itemIsPage(item)) {
    for (const page of item.subPages) {
      const crumbs = findCrumbs({
        asPath,
        item: page,
        parents: [...(parents || []), item],
      });

      if (crumbs) {
        return crumbs;
      }
    }
  }

  const href = itemIsPage(item) ? item.href : `${parentHref}#${item.anchor}`;

  if (asPath === href || (itemIsPage(item) && asPath === `${href}#`)) {
    return [...(parents || []), item];
  }

  return null;
};

const MobileBreadcrumbs: VFC<MobileBreadcrumbsProps> = ({ crumbs }) => {
  const { asPath } = useRouter();

  return (
    <Breadcrumbs
      sx={{
        marginTop: 2,
      }}
      separator={
        <Icon
          sx={{ fontSize: 14, color: ({ palette }) => palette.gray[40] }}
          className="fas fa-chevron-right"
        />
      }
    >
      {crumbs.map((item, i) =>
        i < crumbs.length - 1 ? (
          <Link
            key={item.title}
            href={
              itemIsPage(item)
                ? asPath.startsWith(`${item.href}#`)
                  ? "#"
                  : item.href
                : `#${item.anchor}`
            }
          >
            {item.title}
          </Link>
        ) : (
          <Typography key={item.title} variant="bpSmallCopy" color="inherit">
            {item.title}
          </Typography>
        ),
      )}
    </Breadcrumbs>
  );
};

type MobileNavNestedPageProps<T extends SiteMapPage | SiteMapPageSection> = {
  icon?: JSX.Element;
  item: T;
  parentPageHref: T extends SiteMapPageSection ? string : undefined;
  depth?: number;
  expandedItems: { href: string; depth: number }[];
  setExpandedItems: Dispatch<SetStateAction<{ href: string; depth: number }[]>>;
  onClose: () => void;
};

const MobileNavNestedPage = <T extends SiteMapPage | SiteMapPageSection>({
  icon,
  depth = 0,
  expandedItems,
  parentPageHref,
  setExpandedItems,
  item,
  onClose,
}: MobileNavNestedPageProps<T>) => {
  const router = useRouter();
  const { asPath } = router;
  const { title } = item;

  const isRoot = depth === 0;

  const href = itemIsPage(item)
    ? item.href
    : `${parentPageHref}#${item.anchor}`;

  const isSelected = asPath === href;

  const hasChildren = itemIsPage(item)
    ? item.subPages.length > 0 || item.sections.length > 0
    : item.subSections.length > 0;

  const isOpen =
    hasChildren &&
    expandedItems.some(
      (expandedItem) =>
        expandedItem.href === href && expandedItem.depth === depth,
    );

  return (
    <>
      <Link href={href}>
        <ListItemButton
          selected={isSelected}
          onClick={() => {
            if (hasChildren && !isOpen) {
              setExpandedItems((prev) => [...prev, { href, depth }]);
            }
            onClose();
          }}
          sx={(theme) => ({
            backgroundColor: isRoot ? undefined : theme.palette.gray[20],
            "&.Mui-selected": {
              backgroundColor: isRoot ? undefined : theme.palette.gray[20],
              "&:hover": {
                backgroundColor: isRoot ? undefined : theme.palette.gray[40],
              },
            },
            "&:hover": {
              backgroundColor: isRoot ? undefined : theme.palette.gray[40],
            },
            pl: (icon ? 2 : 4) + depth * 2,
          })}
        >
          {icon || !itemIsPage(item) ? (
            <ListItemIcon
              sx={(theme) => ({
                minWidth: isRoot ? undefined : theme.spacing(3),
              })}
            >
              {icon ?? (
                <Icon
                  sx={{
                    fontSize: 15,
                  }}
                  color="inherit"
                  className="fas fa-hashtag"
                />
              )}
            </ListItemIcon>
          ) : null}
          <ListItemText
            primary={title}
            sx={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              "> .MuiListItemText-primary": {
                display: "inline",
              },
            }}
          />
          {hasChildren ? (
            <IconButton
              sx={{
                transition: (theme) => theme.transitions.create("transform"),
                transform: `rotate(${isOpen ? "0deg" : "-90deg"})`,
              }}
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                setExpandedItems((prev) =>
                  isOpen
                    ? prev.filter(
                        (expandedItem) =>
                          !(
                            expandedItem.href === href &&
                            expandedItem.depth === depth
                          ),
                      )
                    : [...prev, { href, depth }],
                );
              }}
            >
              <Icon
                sx={{
                  fontSize: 15,
                }}
                fontSize="inherit"
                className="fas fa-chevron-down"
              />
            </IconButton>
          ) : null}
        </ListItemButton>
      </Link>
      {hasChildren ? (
        <Collapse in={isOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {itemIsPage(item) ? (
              <>
                {item.subPages.map((subPage) => (
                  <MobileNavNestedPage<SiteMapPage>
                    key={subPage.href}
                    depth={depth + 1}
                    item={subPage}
                    parentPageHref={undefined}
                    expandedItems={expandedItems}
                    setExpandedItems={setExpandedItems}
                    onClose={onClose}
                  />
                ))}
              </>
            ) : null}
            {(itemIsPage(item) ? item.sections : item.subSections).map(
              (subSection) => (
                <MobileNavNestedPage<SiteMapPageSection>
                  key={subSection.anchor}
                  depth={depth + 1}
                  parentPageHref={
                    itemIsPage(item) ? item.href : (parentPageHref as string)
                  }
                  item={subSection}
                  expandedItems={expandedItems}
                  setExpandedItems={setExpandedItems}
                  onClose={onClose}
                />
              ),
            )}
          </List>
          {depth === 0 ? <Divider /> : null}
        </Collapse>
      ) : null}
    </>
  );
};

type MobileNavItemsProps = {
  onClose: () => void;
};

const getInitialExpandedItems = ({
  asPath,
  parentHref,
  item,
  depth = 0,
}: {
  asPath: string;
  parentHref?: string;
  item: SiteMapPage | SiteMapPageSection;
  depth?: number;
}): { href: string; depth: number }[] => {
  const expandedChildren = [
    ...(itemIsPage(item)
      ? item.subPages
          .map((page) =>
            getInitialExpandedItems({ item: page, asPath, depth: depth + 1 }),
          )
          .flat()
      : []),
    ...(itemIsPage(item) ? item.sections : item.subSections)
      .map((section) =>
        getInitialExpandedItems({
          item: section,
          asPath,
          depth: depth + 1,
          parentHref: itemIsPage(item) ? item.href : parentHref,
        }),
      )
      .flat(),
  ];

  const href = itemIsPage(item) ? item.href : `${parentHref}#${item.anchor}`;

  const isExpanded = asPath === href || expandedChildren.length > 0;

  return isExpanded
    ? [
        {
          href,
          depth,
        },
        ...expandedChildren,
      ]
    : [];
};

const MobileNavItems: VFC<MobileNavItemsProps> = ({ onClose }) => {
  const { asPath } = useRouter();
  const { pages } = useContext(SiteMapContext);

  const [expandedItems, setExpandedItems] = useState<
    { href: string; depth: number }[]
  >(
    pages.map((page) => getInitialExpandedItems({ asPath, item: page })).flat(),
  );

  useEffect(() => {
    setExpandedItems((prev) => [
      ...prev,
      ...pages
        .map((page) => getInitialExpandedItems({ asPath, item: page }))
        .flat()
        .filter(
          (expanded) =>
            prev.find(
              ({ depth, href }) =>
                expanded.depth === depth && expanded.href === href,
            ) === undefined,
        ),
    ]);
  }, [asPath, pages]);

  return (
    <List>
      {pages.map((page) => (
        <Fragment key={page.href}>
          <MobileNavNestedPage<SiteMapPage>
            key={page.href}
            icon={NAVBAR_LINK_ICONS[page.title]}
            item={page}
            parentPageHref={undefined}
            expandedItems={expandedItems}
            setExpandedItems={setExpandedItems}
            onClose={onClose}
          />
        </Fragment>
      ))}
    </List>
  );
};

type NavbarProps = {
  navbarHeight: number;
  setNavbarHeight: (height: number) => void;
};

export const Navbar: VFC<NavbarProps> = ({ navbarHeight, setNavbarHeight }) => {
  const theme = useTheme();
  const router = useRouter();
  const { pages } = useContext(SiteMapContext);

  const [displayMobileNav, setDisplayMobileNav] = useState<boolean>(false);
  const [idleScrollPosition, setIdleScrollPosition] = useState<boolean>(false);
  const [scrollY, setScrollY] = useState<number>(0);

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined = undefined;
    const onScroll = () => {
      setScrollY(window.scrollY);
      setIdleScrollPosition(false);
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => {
        setIdleScrollPosition(true);
      }, IDLE_NAVBAR_TIMEOUT_MS);
    };

    onScroll();

    window.addEventListener("scroll", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const { asPath } = router;

  const isHomePage = asPath === "/";

  const md = useMediaQuery(theme.breakpoints.up("md"));
  const sm = useMediaQuery(theme.breakpoints.up("sm"));

  const isDesktopSize = md;

  const crumbs = useMemo(() => {
    const breadCrumbPages = pages.filter(({ title }) =>
      ["Specification", "Documentation"].includes(title),
    );

    for (const page of breadCrumbPages) {
      const maybeCrumbs = findCrumbs({ asPath, item: page });
      if (maybeCrumbs) {
        return maybeCrumbs;
      }
    }
    return [];
  }, [asPath, pages]);

  const displayBreadcrumbs =
    !isDesktopSize && !displayMobileNav && crumbs.length > 0;

  useEffect(() => {
    setNavbarHeight(
      (isDesktopSize ? DESKTOP_NAVBAR_HEIGHT : MOBILE_NAVBAR_HEIGHT) +
        (displayBreadcrumbs ? BREAD_CRUMBS_HEIGHT : 0),
    );
  }, [isDesktopSize, displayBreadcrumbs, setNavbarHeight]);

  useEffect(() => {
    if (isDesktopSize && displayMobileNav) {
      setDisplayMobileNav(false);
    }
  }, [isDesktopSize, displayMobileNav]);

  /** @todo: provide better documentation for the various states of the Navbar's styling */

  const trigger = useScrollTrigger();

  const isScrollYAtTopOfPage = scrollY === 0;

  const isScrollYPastHeader = scrollY > HOME_PAGE_HEADER_HEIGHT;

  const isNavbarPositionAbsolute =
    isHomePage && !displayMobileNav && scrollY < HOME_PAGE_HEADER_HEIGHT * 0.5;

  const isNavbarTransparent =
    isHomePage && !displayMobileNav && !isScrollYPastHeader;

  const isBorderBottomTransparent =
    isNavbarTransparent || (isScrollYAtTopOfPage && !displayMobileNav);

  const isNavbarHidden =
    (trigger ||
      (isHomePage && !isScrollYPastHeader) ||
      (idleScrollPosition && !isScrollYAtTopOfPage)) &&
    !displayMobileNav;

  const isBoxShadowTransparent =
    isBorderBottomTransparent || displayMobileNav || isNavbarHidden;

  /**
   * The Navbar is dark when
   *  - the user is on the homepage, and
   *  - the user hasn't scrolled past the header element, and
   *  - the user is not currently displaying the mobile navigation menu
   */
  const isNavbarDark = isHomePage && !displayMobileNav && !isScrollYPastHeader;

  const hiddenNavbarTopOffset =
    -1 * (navbarHeight - (displayBreadcrumbs ? BREAD_CRUMBS_HEIGHT : 0));

  return (
    <Box
      sx={{
        width: "100%",
        position: "absolute",
        zIndex: ({ zIndex }) => zIndex.appBar,
      }}
    >
      <Box
        sx={{
          width: "100%",
          position: isNavbarPositionAbsolute ? "absolute" : "fixed",
          top:
            isNavbarHidden && !isNavbarPositionAbsolute
              ? hiddenNavbarTopOffset
              : 0,
          zIndex: theme.zIndex.appBar,
          py: isDesktopSize ? 2 : 1,
          backgroundColor: isNavbarTransparent
            ? "transparent"
            : theme.palette.common.white,
          transition: [
            isHomePage &&
            !displayMobileNav &&
            scrollY < HOME_PAGE_HEADER_HEIGHT * 0.75
              ? []
              : theme.transitions.create("top", { duration: 300 }),
            theme.transitions.create(
              [
                "padding-top",
                "padding-bottom",
                "box-shadow",
                "border-bottom-color",
                "background-color",
              ].flat(),
            ),
          ]
            .flat()
            .join(", "),
          borderBottomStyle: "solid",
          borderBottomColor: isBorderBottomTransparent
            ? "transparent"
            : theme.palette.gray[30],
          borderBottomWidth: 1,
          /** @todo: find way to make drop-shadow appear behind mobile navigation links */
          boxShadow: isBoxShadowTransparent ? "none" : theme.shadows[1],
        }}
      >
        <Container>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Link href="/">
              <BlockProtocolLogoIcon
                onClick={() => setDisplayMobileNav(false)}
                sx={{
                  color: ({ palette }) =>
                    isNavbarDark ? palette.purple[400] : palette.gray[80],
                }}
              />
            </Link>
            <Box display="flex" alignItems="center">
              {md ? (
                <>
                  {pages.map(({ title, href }) => (
                    <Link
                      href={href}
                      key={href}
                      sx={({ palette }) => ({
                        display: "flex",
                        alignItems: "center",
                        marginRight: 3,
                        transition: theme.transitions.create("color", {
                          duration: 100,
                        }),
                        color: isNavbarDark
                          ? palette.purple[400]
                          : asPath.startsWith(href)
                          ? palette.purple[600]
                          : palette.gray[60],
                        "&:hover": {
                          color: isNavbarDark
                            ? palette.gray[30]
                            : palette.purple[600],
                        },
                        "&:active": {
                          color: isNavbarDark
                            ? palette.common.white
                            : palette.purple[700],
                        },
                      })}
                    >
                      {NAVBAR_LINK_ICONS[title]}
                      <Typography
                        sx={{
                          marginLeft: 1,
                          fontWeight: 500,
                          fontSize: "var(--step--1)",
                          color: "currentColor",
                        }}
                      >
                        {title}
                      </Typography>
                    </Link>
                  ))}
                  <Link href="/docs/developing-blocks">
                    <Button
                      size="small"
                      variant="primary"
                      endIcon={<BoltIcon />}
                    >
                      Quick Start Guide
                    </Button>
                  </Link>
                </>
              ) : (
                <IconButton
                  onClick={() => setDisplayMobileNav(!displayMobileNav)}
                  sx={{
                    "& svg": isNavbarDark
                      ? { color: theme.palette.purple.subtle }
                      : {},
                  }}
                >
                  <Icon className="fas fa-bars" />
                </IconButton>
              )}
            </Box>
          </Box>
          <Collapse in={displayBreadcrumbs}>
            <MobileBreadcrumbs crumbs={crumbs} />
          </Collapse>
        </Container>
      </Box>
      <Slide in={displayMobileNav}>
        <Box
          sx={{
            zIndex: 1,
            marginTop: `${MOBILE_NAVBAR_HEIGHT}px`,
            position: "fixed",
            background: theme.palette.common.white,
            top: 0,
            left: 0,
            width: "100%",
            height: `calc(100% - ${MOBILE_NAVBAR_HEIGHT}px)`,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <Box
            sx={{
              overflow: "auto",
            }}
          >
            <MobileNavItems onClose={() => setDisplayMobileNav(false)} />
          </Box>
          <Box
            p={5}
            flexShrink={0}
            sx={{
              borderTopStyle: "solid",
              borderTopWidth: 1,
              borderTopColor: theme.palette.gray[40],
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Link href="/docs/developing-blocks">
              <Button
                sx={{
                  py: 1.5,
                  px: 3,
                  textTransform: "none",
                }}
                variant="primary"
                startIcon={<BoltIcon />}
                onClick={() => setDisplayMobileNav(false)}
              >
                {sm ? "Get started building blocks" : "Build a block"}
              </Button>
            </Link>
          </Box>
        </Box>
      </Slide>
    </Box>
  );
};

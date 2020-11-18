import sanbbdom, { h } from "./lib/snabbdom"

const vnode = h("div", { id: "container" }, [
  h(
    "span",
    { style: { fontWeight: "bold" } },
    "This is bold"
  ),
  " and this is just normal text",
  h(
    "a",
    {
      props: { href: "/foo" },
    },
    "I'll take you places!"
  ),
])

console.log(vnode)

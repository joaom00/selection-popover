import { usePackageManagerPreference } from '@/components/PackageManagerPreference'
import { PACKAGE_MANAGERS_COMMAND } from '@/lib/constants'
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  SelectionCopyCommand,
  SelectionActionsBar,
} from '@/components'
import { SelectionTextToolbar } from '@/components/selection/TextToolbar'

export default function Home() {
  const [packagerManager] = usePackageManagerPreference()

  return (
    <div className="min-h-screen bg-mauve1 py-8 flex flex-col justify-center relative overflow-hidden lg:py-12">
      <div className="gradient" />
      <div className="absolute inset-0 bg-top pattern" />
      <main className="relative w-full md:max-w-3xl md:mx-auto lg:max-w-4xl mt-10">
        <h1 className="text-mauve12 text-4xl font-medium text-center tracking-tighter mb-5">
          Selection Popover
        </h1>
        <SelectionCopyCommand>
          <p className="text-sm tracking-tight bg-white rounded-full px-5 py-2 border border-gray6 max-w-max mx-auto mb-20 text-gray12">
            {PACKAGE_MANAGERS_COMMAND[packagerManager]}
          </p>
        </SelectionCopyCommand>
        <Tabs defaultValue="action-bar">
          <TabsList>
            <TabsTrigger value="action-bar">Action bar</TabsTrigger>
            <TabsTrigger value="editor-toolbar">Text formatting toolbar</TabsTrigger>
          </TabsList>
          <SelectionActionsBar>
            <TabsContent value="action-bar">
              <div className="w-full px-6 py-12 bg-white rounded-md shadow-xl shadow-mauve12/10 ring-1 ring-mauve6 lg:pt-16 lg:pb-28">
                <div className="prose prose-slate mx-auto lg:prose-lg">
                  <p className="lead">
                    Until now, trying to style an article, document, or blog post with Tailwind has
                    been a tedious task that required a keen eye for typography and a lot of complex
                    custom CSS.
                  </p>
                  <p>
                    By default, Tailwind removes all of the default browser styling from paragraphs,
                    headings, lists and more. This ends up being really useful for building
                    application UIs because you spend less time undoing user-agent styles, but when
                    you <em>really are</em> just trying to style some content that came from a
                    rich-text editor in a CMS or a markdown file, it can be surprising and
                    unintuitive.
                  </p>
                  <p>
                    We get lots of complaints about it actually, with people regularly asking us
                    things like:
                  </p>
                  <blockquote>
                    <p>
                      Why is Tailwind removing the default styles on my <code>h1</code> elements?
                      How do I disable this? What do you mean I lose all the other base styles too?
                    </p>
                  </blockquote>
                  <p>
                    We hear you, but we&apos;re not convinced that simply disabling our base styles
                    is what you really want. You don&apos;t want to have to remove annoying margins
                    every time you use a <code>p</code> element in a piece of your dashboard UI. And
                    I doubt you really want your blog posts to use the user-agent styles either —
                    you want them to look <em>awesome</em>, not awful.
                  </p>
                  <p>
                    The <code>@tailwindcss/typography</code> plugin is our attempt to give you what
                    you <em>actually</em> want, without any of the downsides of doing something
                    stupid like disabling our base styles.
                  </p>
                  <p>
                    It adds a new <code>prose</code> class that you can slap on any block of vanilla
                    HTML content and turn it into a beautiful, well-formatted document:
                  </p>
                  <pre>
                    <code className="language-html">
                      &lt;article class=&quot;prose&quot;&gt; &lt;h1&gt;Garlic bread with cheese:
                      What the science tells us&lt;/h1&gt; &lt;p&gt; For years parents have espoused
                      the health benefits of eating garlic bread with cheese to their children, with
                      the food earning such an iconic status in our culture that kids will often
                      dress up as warm, cheesy loaf for Halloween. &lt;/p&gt; &lt;p&gt; But a recent
                      study shows that the celebrated appetizer may be linked to a series of rabies
                      cases springing up around the country. &lt;/p&gt; &lt;!-- ... --&gt;
                      &lt;/article&gt;
                    </code>
                  </pre>
                  <p>
                    For more information about how to use the plugin and the features it includes,{' '}
                    <a href="https://github.com/tailwindcss/typography/blob/master/README.md">
                      read the documentation
                    </a>
                    .
                  </p>
                </div>
              </div>
            </TabsContent>
          </SelectionActionsBar>

          <SelectionTextToolbar>
            <TabsContent asChild value="editor-toolbar">
              <div className="w-full px-6 py-12 bg-white rounded-md shadow-xl shadow-mauve12/10 ring-1 ring-mauve6 lg:pt-16 lg:pb-28">
                <div className="prose prose-slate mx-auto lg:prose-lg">
                  <h2>What to expect from here on out</h2>
                  <p>
                    What follows from here is just a bunch of absolute nonsense I&apos;ve written to
                    dogfood the plugin itself. It includes every sensible typographic element I
                    could think of, like <strong>bold text</strong>, unordered lists, ordered lists,
                    code blocks, block quotes, <em>and even italics</em>.
                  </p>
                  <p>It&apos;s important to cover all of these use cases for a few reasons:</p>
                  <ol>
                    <li>We want everything to look good out of the box.</li>
                    <li>
                      Really just the first reason, that&apos;s the whole point of the plugin.
                    </li>
                    <li>
                      Here&apos;s a third pretend reason though a list with three items looks more
                      realistic than a list with two items.
                    </li>
                  </ol>
                  <p>Now we&apos;re going to try out another header style.</p>
                  <h3>Typography should be easy</h3>
                  <p>
                    So that&apos;s a header for you — with any luck if we&apos;ve done our job
                    correctly that will look pretty reasonable.
                  </p>
                  <p>Something a wise person once told me about typography is:</p>
                  <blockquote>
                    <p>
                      Typography is pretty important if you don&apos;t want your stuff to look like
                      trash. Make it good then it won&apos;t be bad.
                    </p>
                  </blockquote>
                  <p>It&apos;s probably important that images look okay here by default as well:</p>
                  <figure>
                    <img
                      src="https://images.unsplash.com/photo-1556740758-90de374c12ad?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=crop&amp;w=1000&amp;q=80"
                      alt=""
                    />
                    <figcaption>
                      Contrary to popular belief, Lorem Ipsum is not simply random text. It has
                      roots in a piece of classical Latin literature from 45 BC, making it over 2000
                      years old.
                    </figcaption>
                  </figure>
                  <p>
                    Now I&apos;m going to show you an example of an unordered list to make sure that
                    looks good, too:
                  </p>
                  <ul>
                    <li>So here is the first item in this list.</li>
                    <li>In this example we&apos;re keeping the items short.</li>
                    <li>Later, we&apos;ll use longer, more complex list items.</li>
                  </ul>
                  <p>And that&apos;s the end of this section.</p>
                </div>
              </div>
            </TabsContent>
          </SelectionTextToolbar>
        </Tabs>
      </main>
      <div className="relative text-mauve11 text-center mt-20 text-sm flex items-center justify-center gap-1">
        Created by{' '}
        <a
          className="flex items-center gap-1 text-mauve12"
          href="https://jpedromagalhaes.vercel.app/"
          target="_blank"
          rel="noreferrer noopener"
        >
          <img
            className="w-5 h-5 rounded-full border border-mauve6"
            src="https://github.com/joaom00.png"
            alt="Avatar of joaom00"
          />
          joaom00
        </a>
      </div>
    </div>
  )
}

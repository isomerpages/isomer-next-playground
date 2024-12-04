# Isomer Next JSON samples

Here are sample JSON blocks that can be used to quickly add components to your page. Visit [Isomer Next Storybook](https://storybook-next.isomer.gov.sg) to know what components are available.

## Layouts

There are 8 layouts in total, but 3 of them are used on a regular basis.

<details>
<summary><b>Content Page Layout (main type of pages not within a collection)</b></summary>

This page contains a siderail, automatically generated table of contents, breadcrumbs and allows the page title/summary to be featured. You must have the `contentPageHeader` and `title` properties inside `page`.

```json
{
  "version": "0.1.0",
  "layout": "content",
  "page": {
    "contentPageHeader": {
      "summary": "Steven Pinker's exploration of rationality delves into the intricacies of human cognition, shedding light on the mechanisms behind our decision-making processes.",
      "buttonLabel": "Submit a proposal",
      "buttonUrl": "/submit-proposal"
    },
    "title": "Content page",
    "description": "A Next.js starter for Isomer"
  },
  "content": [
    {
      "type": "prose",
      "content": [
        {
          "type": "heading",
          "attrs": {
            "id": "section1",
            "level": 2
          },
          "content": [
            {
              "type": "text",
              "marks": [],
              "text": "What does the Irrationality Principle support?"
            }
          ]
        }
      ]
    }
  ]
}
```

More examples are available in the [Content layout storybook](https://storybook-next.isomer.gov.sg/?path=/docs/next-layouts-content--docs).

</details>

<details>
<summary><b>Article Page Layout (for pages within collections, e.g. press release)</b></summary>

This page contains a category, date and an article summary. You must have the `articlePageHeader`, `category`, `date` and `title` properties inside `page`.

For the summary, having just one item in the list will automatically show a paragraph in the summary rather than a bullet list.

```json
{
  "version": "0.1.0",
  "layout": "article",
  "page": {
    "articlePageHeader": {
      "summary": "Singapore is preparing to host its inaugural Citizens' Festival in Marina Boulevard. The festival aims to unite Singaporeans of all backgrounds through cultural showcases, food markets, live music, and wellness activities."
    },
    "title": "Singapore's Spectacular Citizens' Festival: a Celebration of Unity and Diversity",
    "category": "Citizen Engagement",
    "date": "1 May 2024"
  },
  "content": [
    {
      "type": "image",
      "src": "https://images.unsplash.com/photo-1570441262582-a2d4b9a916a5?q=80&w=2948&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "alt": "A man is serving food out of a blue food"
    }
  ]
}
```

</details>

<details>
<summary><b>Home Page Layout (for the root page of the site)</b></summary>

This should contain the Hero component as the first content element (although this is not enforced). It should also not contain any Prose content.

```json
{
  "version": "0.1.0",
  "layout": "homepage",
  "page": {
    "title": "Home"
  },
  "content": [
    {
      "type": "hero",
      "variant": "gradient",
      "alignment": "left",
      "backgroundColor": "black",
      "title": "Ministry of Trade and Industry",
      "subtitle": "A leading global city of enterprise and talent, a vibrant nation of innovation and opportunity",
      "buttonLabel": "Main CTA",
      "buttonUrl": "/",
      "secondaryButtonLabel": "Sub CTA",
      "secondaryButtonUrl": "/",
      "backgroundUrl": "https://ohno.isomer.gov.sg/images/hero-banner.png"
    },
    {
      "type": "infobar",
      "title": "This is an infobar",
      "description": "This is the description that goes into the Infobar section"
    },
    {
      "type": "infopic",
      "title": "This is an infopic",
      "description": "This is the description for the infopic component",
      "imageSrc": "https://placehold.co/600x400"
    },
    {
      "type": "keystatistics",
      "statistics": [
        {
          "label": "Average all nighters pulled in a typical calendar month",
          "value": "3"
        },
        {
          "label": "Growth in tasks assigned Q4 2024 (YoY)",
          "value": "+12.2%"
        },
        {
          "label": "Creative blocks met per single evening",
          "value": "89"
        },
        {
          "value": "4.0",
          "label": "Number of lies in this stat block"
        }
      ],
      "variant": "top",
      "title": "Irrationality in numbers"
    }
  ]
}
```

</details>

## Components

Components make up the main building blocks of an Isomer page, and all components are designed to be used regardless of the layout of the page. Most components can be used directly within the `content` key, except for some that requires the use of a Prose content block.

<details>
<summary><b>Accordion (for hiding big chunks of text behind a toggle)</b></summary>

Accordion takes in a `summary` (the part that users see first before toggling) and `details` (the main content that is hidden behind the toggle). The `details` key takes in a single Prose block (so you cannot add images inside).

```json
{
  "type": "accordion",
  "summary": "Title for the accordion item",
  "details": {
    "type": "prose",
    "content": [
      {
        "type": "paragraph",
        "content": [
          {
            "type": "text",
            "text": "Enter content for the accordion here."
          }
        ]
      }
    ]
  }
}
```

</details>

<details>
<summary><b>Callout (for highlighting certain content)</b></summary>

Callout takes in a single Prose content block (notice the braces in `content`).

```json
{
  "type": "callout",
  "content": {
    "type": "prose",
    "content": [
      {
        "type": "paragraph",
        "content": [
          {
            "type": "text",
            "text": "Callout content"
          }
        ]
      }
    ]
  }
}
```

</details>

<details>
<summary><b>Image (for displaying graphical content)</b></summary>

This is the `<img>` HTML tag to load graphical content (i.e. pictures and GIFs). In addition, you need to provide an alt text to describe the image.

In the `src` field, you should always begin with a `/images`. This is so that you are loading resources from within the site and not elsewhere (which can sometimes be illegal). However, note that on the playground, it’s **not possible to load the actual image** (and you will definitely see an error), so just save your changes and see it on the actual staging site.

To upload images to your site, put them inside the `/public/images` folder, then use them in your page.

```json
{
  "type": "image",
  "src": "/images/1.png",
  "alt": "Add your alt text here"
}
```

</details>

<details>
<summary><b>InfoCards (for displaying a list of items in a grid with cards)</b></summary>

InfoCards is useful if you have a section that contains multiple items, each of them being in a separate page. Each card allows you to link to the page and provide a brief description.

There is no limit on the number of cards, but do not go too crazy (definitely keep it below 24).

```json
{
  "type": "infocards",
  "variant": "cardsWithImages",
  "title": "This is an optional title of the Infocards component",
  "subtitle": "This is an optional subtitle for the Infocards component",
  "cards": [
    {
      "title": "This is the first card",
      "url": "https://www.google.com",
      "imageUrl": "https://placehold.co/200x200",
      "imageAlt": "This is the alt text"
    },
    {
      "title": "This is the second card",
      "url": "https://www.google.com",
      "imageUrl": "https://placehold.co/400x200",
      "imageAlt": "This is the alt text"
    },
    {
      "title": "This is the third card",
      "url": "https://www.google.com",
      "imageUrl": "https://placehold.co/500x200",
      "imageAlt": "This is the alt text"
    }
  ]
}
```

</details>

<details>
<summary><b>InfoCols (for displaying a list of items in a grid without the cards/images)</b></summary>

InfoCols is an alternative display to InfoCards for items that do not link to another page. There is a maximum of 6 columns that you can have in a single component.

For the icons, there is only a limited set available. We will be adding more in the future.

```json
{
  "type": "infocols",
  "title": "This is the main title of the InfoCols component",
  "subtitle": "This is an optional subtitle for the InfoCols component.",
  "infoBoxes": [
    {
      "title": "This is the title of the first column",
      "description": "You can also add additional description here",
      "icon": "office-building"
    },
    {
      "title": "This is the title of the second column",
      "description": "You can also add additional description here",
      "icon": "stars"
    },
    {
      "title": "This is the title of the third column",
      "description": "You can also add additional description here",
      "icon": "globe"
    }
  ]
}
```

</details>

<details>
<summary><b>Infobar (for a large callout to your visitor with call-to-action buttons)</b></summary>

The Infobar presents a large heading text to the user and is usually used on the homepage. You can add an optional description and up to 2 call-to-action buttons within the same component.

```json
{
  "type": "infobar",
  "title": "This is the main title",
  "description": "This is an optional description"
}
```

</details>

<details>
<summary><b>Infopic (for displaying content with an associated picture)</b></summary>

The Infopic component is very similar to the Infobar component, with an additional image either on the left or right side (this is automatically determined by its position on the page).

Ignore the `sectionIdx` field, it is not needed. The `subtitle` field is also not used in the Next theme (but we have a hidden classic theme that uses it!).

```json
{
  "type": "infopic",
  "title": "This is an infopic",
  "description": "This is the description for the infopic component",
  "imageSrc": "https://placehold.co/600x400"
}
```

</details>

<details>
<summary><b>KeyStatistics (for displaying statistics you want to highlight)</b></summary>

This component is a special one that is used for highlighting important statistical information. It is extremely unlikely you will be using this component, but if you have numbers to present, this is the one.

For the value, do not go beyond 7 characters. This should cover a large majority of cases. The `top` variant allows you to have up to 4 statistics, whereas the `side` variant only allows you to have 3.

```json
{
  "type": "keystatistics",
  "variant": "top",
  "title": "Irrationality in numbers",
  "statistics": [
    {
      "label": "Average all nighters pulled in a typical calendar month",
      "value": "3"
    },
    {
      "label": "Growth in tasks assigned Q4 2024 (YoY)",
      "value": "+12.2%"
    },
    {
      "label": "Creative blocks met per single evening",
      "value": "89"
    },
    {
      "value": "4.0",
      "label": "Number of lies in this stat block"
    }
  ]
}
```

</details>

<details>
<summary><b>Maps embeds (for embedding Google Maps)</b></summary>

This component is used to embed Google Maps (or OneMap) into the page.

```json
{
  "type": "map",
  "title": "Office of Open Government Products, Singapore",
  "url": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d997.1986718091739!2d103.84951406959217!3d1.2979038406790597!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31da19ec2599519d%3A0x809fd655663da6d0!2sLazada%20One!5e0!3m2!1sen!2ssg!4v1731681752852!5m2!1sen!2ssg"
}
```

</details>

<details>
<summary><b>Video embeds (for embedding YouTube)</b></summary>

This component is used to embed YouTube, Vimeo or Facebook Watch into the page.

```json
{
  "type": "video",
  "title": "Rick Astley - Never Gonna Give You Up",
  "url": "https://www.youtube.com/embed/dQw4w9WgXcQ?si=ggGGn4uvFWAIelWD"
}
```

</details>

### Prose block

These components are treated specially and have to be wrapped around a single content block in order to be rendered (with type `prose`).

<details>
<summary><b>Divider (for providing a visual separation of content)</b></summary>

This is a horizontal rule (`<hr />`) if you are familiar with HTML.

```json
{
  "type": "prose",
  "content": [
    {
      "type": "divider"
    }
  ]
}
```

</details>

<details>
<summary><b>Heading (for creating new sections within a page)</b></summary>

We only support creating heading levels 2 to 6. Also, you should not skip any heading levels within a page (the next heading level after a level 2 heading should be 2/3 and not 4/5/6).

We do not allow styling of the headings (even though it appears to be allowed).

```json
{
  "type": "prose",
  "content": [
    {
      "type": "heading",
      "attrs": {
        "level": 2
      },
      "content": [
        {
          "type": "text",
          "text": "This is a heading"
        }
      ]
    }
  ]
}
```

</details>

<details>
<summary><b>Paragraph (main meat of your page)</b></summary>

Paragraphs are blocks of text, and you can do styling or even add links (called marks). The supported marks are: `bold`, `code`, `italic`, `link`, `strike`, `subscript`, `superscript` and `underline`.

For the same text, multiple marks can be applied at the same time.

```json
{
  "type": "prose",
  "content": [
    {
      "type": "paragraph",
      "content": [
        {
          "type": "text",
          "marks": [],
          "text": "This is a paragraph with an "
        },
        {
          "type": "text",
          "marks": [
            {
              "type": "underline"
            }
          ],
          "text": "underlined"
        },
        {
          "type": "text",
          "marks": [],
          "text": " text."
        }
      ]
    }
  ]
}
```

Unfortunately, you will need to be very explicit on which parts of the text you want to apply a mark to.

Additionally, you can add **line breaks** so that you can move content to the next line without creating a whole new paragraph.

```json
{
  "type": "paragraph",
  "content": [
    {
      "type": "hardBreak"
    }
  ]
}
```

For your convenience, the marks snippets are here:

- **Bold**

  ```json
  {
    "type": "text",
    "marks": [
      {
        "type": "bold"
      }
    ],
    "text": "bold text"
  }
  ```

- **Code**

  ```json
  {
    "type": "text",
    "marks": [
      {
        "type": "code"
      }
    ],
    "text": "code"
  }
  ```

- **Italic**

  ```json
  {
    "type": "text",
    "marks": [
      {
        "type": "italic"
      }
    ],
    "text": "italics text"
  }
  ```

- **Link**

  ```json
  {
    "type": "text",
    "marks": [
      {
        "type": "link",
        "attrs": {
          "href": "https://www.isomer.gov.sg"
        }
      }
    ],
    "text": "hyperlink"
  }
  ```

- **Strike**

  ```json
  {
    "type": "text",
    "marks": [
      {
        "type": "strike"
      }
    ],
    "text": "strikethrough text"
  }
  ```

- **Subscript**

  ```json
  {
    "type": "text",
    "marks": [
      {
        "type": "subscript"
      }
    ],
    "text": "subscript"
  }
  ```

- **Superscript**

  ```json
  {
    "type": "text",
    "marks": [
      {
        "type": "superscript"
      }
    ],
    "text": "superscript"
  }
  ```

- **Underline**

  ```json
  {
    "type": "text",
    "marks": [
      {
        "type": "underline"
      }
    ],
    "text": "underlined text"
  }
  ```

</details>

<details>
<summary><b>OrderedList (for creating numbered lists)</b></summary>

OrderedLists are useful when you need to list items with a certain sequence to them. Within OrderedLists are ListItems, which itself takes either a Paragraph or a nested list.

If you need, you can also customise the starting number of the list.

```json
{
  "type": "prose",
  "content": [
    {
      "type": "orderedList",
      "attrs": {
        "start": 1
      },
      "content": [
        {
          "type": "listItem",
          "content": [
            {
              "type": "paragraph",
              "content": [
                {
                  "type": "text",
                  "marks": [],
                  "text": "This is the first list item"
                }
              ]
            }
          ]
        },
        {
          "type": "listItem",
          "content": [
            {
              "type": "paragraph",
              "content": [
                {
                  "type": "text",
                  "marks": [],
                  "text": "This is the second list item"
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}
```

More examples (e.g. nested lists) are available [in the OrderedList storybook](https://storybook-next.isomer.gov.sg/?path=/docs/next-components-orderedlist--docs).

</details>

<details>
<summary><b>Tables (for organising structured content)</b></summary>

Tables comes with a table header, table cells and a compulsory table caption. You need to get the number of cells correct, or **you will get missing cells in your table**! You can also do `colspan` or `rowspan` on a TableHeader or TableCell for it to span multiple columns/rows.

- **Table hierarchy**

Remember this hierarchy:

- Prose
  - Table
    - TableRow
      - TableHeader
        - Paragraph
          - Text
      - TableCell
        - Divider
        - Paragraph
        - OrderedList
        - UnorderedList

I’m going to be doing a dead simple one here, can refer to more complex cases in [the Table component Storybook](https://storybook-next.isomer.gov.sg/?path=/docs/next-components-table--docs).

```json
{
  "type": "prose",
  "content": [
    {
      "type": "table",
      "attrs": {
        "caption": "This is the caption for the table"
      },
      "content": [
        {
          "type": "tableRow",
          "content": [
            {
              "type": "tableHeader",
              "content": [
                {
                  "type": "paragraph",
                  "content": [
                    {
                      "type": "text",
                      "text": "Table Header 1"
                    }
                  ]
                }
              ]
            },
            {
              "type": "tableHeader",
              "content": [
                {
                  "type": "paragraph",
                  "content": [
                    {
                      "type": "text",
                      "text": "Table Header 2"
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          "type": "tableRow",
          "content": [
            {
              "type": "tableCell",
              "content": [
                {
                  "type": "paragraph",
                  "content": [
                    {
                      "type": "text",
                      "text": "Table Cell 1"
                    }
                  ]
                }
              ]
            },
            {
              "type": "tableCell",
              "content": [
                {
                  "type": "paragraph",
                  "content": [
                    {
                      "type": "text",
                      "text": "Table Cell 2"
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}
```

</details>

<details>
<summary><b>UnorderedList (for creating bullet lists)</b></summary>

UnorderedLists are useful when presenting main points of a certain topic in no particular order. Within UnorderedLists are ListItems, which itself takes either a Paragraph or a nested list (notice the syntax is very similar to that of OrderedList).

```json
{
  "type": "prose",
  "content": [
    {
      "type": "unorderedList",
      "content": [
        {
          "type": "listItem",
          "content": [
            {
              "type": "paragraph",
              "content": [
                {
                  "type": "text",
                  "marks": [],
                  "text": "This is the first list item"
                }
              ]
            }
          ]
        },
        {
          "type": "listItem",
          "content": [
            {
              "type": "paragraph",
              "content": [
                {
                  "type": "text",
                  "marks": [],
                  "text": "This is the second list item"
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}
```

</details>

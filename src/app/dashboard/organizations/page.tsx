import { AppSidebar } from '@/components/components/organization-sidebar'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from '@/components/components/ui/breadcrumb'
import { Separator } from '@/components/components/ui/separator'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/components/ui/sidebar'

export default function Page() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/organizations">
                    Phòng sách
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 w-full overflow-y-hidden">
          <div className="flex-grow h-full overflow-y-auto">
            <div className="w-full min-h-full flex flex-col items-stretch" >
              <div className="max-w-[1200px] px-4 @lg:px-6 @xl:px-10 w-full mx-auto pt-12">
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="space-y-1">
                          <h1 className="">Your Organizations</h1>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                    </div>
                  </div>
                </div>
              </div>
              <div className="mx-auto w-full max-w-[1200px] px-4 @lg:px-6 @xl:px-10">
                <div className="first:pt-12 py-6 w-full flex flex-col gap-y-4">
                  <div className="flex items-center justify-between gap-x-2 md:gap-x-3">
                    <div className="relative group">
                      <input placeholder="Search for an organization" className="flex rounded-md border border-control bg-foreground/[.026] file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-foreground-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-background-control focus-visible:ring-offset-2 focus-visible:ring-offset-foreground-muted disabled:cursor-not-allowed disabled:opacity-50 aria-[] aria-[invalid=true]:bg-destructive-200 aria-[invalid=true]:border-destructive-400 aria-[invalid=true]:focus:border-destructive aria-[invalid=true]:focus-visible:border-destructive text-xs px-2.5 py-1 h-[26px] pl-10 w-full flex-1 md:w-64 [&amp;&gt;div&gt;div&gt;div&gt;input]:!pl-7 [&amp;&gt;div&gt;div&gt;div&gt;div]:!pl-2" value="" />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-foreground-light">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search">
                          <circle cx="11" cy="11" r="8"></circle>
                          <path d="m21 21-4.3-4.3"></path>
                        </svg>
                      </div>
                    </div>
                    <a data-size="tiny" type="button" className="relative justify-center cursor-pointer inline-flex items-center space-x-2 text-center font-regular ease-out duration-200 rounded-md outline-none transition-all outline-0 focus-visible:outline-4 focus-visible:outline-offset-1 border bg-brand-400 dark:bg-brand-500 hover:bg-brand/80 dark:hover:bg-brand/50 text-foreground border-brand-500/75 dark:border-brand/30 hover:border-brand-600 dark:hover:border-brand focus-visible:outline-brand-600 data-[state=open]:bg-brand-400/80 dark:data-[state=open]:bg-brand-500/80 data-[state=open]:outline-brand-600 text-xs px-2.5 py-1 h-[26px] w-min" href="/dashboard/new">
                      <div className="[&amp;_svg]:h-[14px] [&amp;_svg]:w-[14px] text-brand-600">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-plus">
                          <path d="M5 12h14"></path>
                          <path d="M12 5v14"></path>
                        </svg>
                      </div>
                      <span className="truncate">New organization</span>
                    </a>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <a href="/dashboard/org/flfbwsgbgifksdcwalgh">
                      <div className="overflow-hidden rounded-lg text-card-foreground shadow-sm grow bg-surface-100 p-3 transition-colors hover:bg-surface-200 border border-light hover:border-default cursor-pointer flex items-center min-h-[70px] [&amp;&gt;div]:w-full [&amp;&gt;div]:items-center">
                        <div className="relative flex items-start gap-3">
                          <div className="rounded-full bg border w-8 h-8 flex items-center justify-center flex-shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-boxes text-foreground">
                              <path d="M2.97 12.92A2 2 0 0 0 2 14.63v3.24a2 2 0 0 0 .97 1.71l3 1.8a2 2 0 0 0 2.06 0L12 19v-5.5l-5-3-4.03 2.42Z"></path>
                              <path d="m7 16.5-4.74-2.85"></path>
                              <path d="m7 16.5 5-3"></path>
                              <path d="M7 16.5v5.17"></path>
                              <path d="M12 13.5V19l3.97 2.38a2 2 0 0 0 2.06 0l3-1.8a2 2 0 0 0 .97-1.71v-3.24a2 2 0 0 0-.97-1.71L17 10.5l-5 3Z"></path>
                              <path d="m17 16.5-5-3"></path>
                              <path d="m17 16.5 4.74-2.85"></path>
                              <path d="M17 16.5v5.17"></path>
                              <path d="M7.97 4.42A2 2 0 0 0 7 6.13v4.37l5 3 5-3V6.13a2 2 0 0 0-.97-1.71l-3-1.8a2 2 0 0 0-2.06 0l-3 1.8Z"></path>
                              <path d="M12 8 7.26 5.15"></path>
                              <path d="m12 8 4.74-2.85"></path>
                              <path d="M12 13.5V8"></path>
                            </svg>
                          </div>
                          <div className="flex-grow flex flex-col gap-0 min-w-0">
                            <h3 title="ASFB Ltd" className="text-sm text-foreground mb-0 truncate max-w-full">ASFB Ltd</h3>
                            <div className="flex items-center justify-between text-xs text-foreground-light font-sans">
                              <div className="flex items-center gap-x-1.5">
                                <span>Free Plan</span>
                                <span>•</span>
                                <span>1 project</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </a>
                    <a href="/dashboard/org/tsrilgezysgjjlleybao">
                      <div className="overflow-hidden rounded-lg text-card-foreground shadow-sm grow bg-surface-100 p-3 transition-colors hover:bg-surface-200 border border-light hover:border-default cursor-pointer flex items-center min-h-[70px] [&amp;&gt;div]:w-full [&amp;&gt;div]:items-center">
                        <div className="relative flex items-start gap-3">
                          <div className="rounded-full bg border w-8 h-8 flex items-center justify-center flex-shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-boxes text-foreground">
                              <path d="M2.97 12.92A2 2 0 0 0 2 14.63v3.24a2 2 0 0 0 .97 1.71l3 1.8a2 2 0 0 0 2.06 0L12 19v-5.5l-5-3-4.03 2.42Z"></path>
                              <path d="m7 16.5-4.74-2.85"></path>
                              <path d="m7 16.5 5-3"></path>
                              <path d="M7 16.5v5.17"></path>
                              <path d="M12 13.5V19l3.97 2.38a2 2 0 0 0 2.06 0l3-1.8a2 2 0 0 0 .97-1.71v-3.24a2 2 0 0 0-.97-1.71L17 10.5l-5 3Z"></path>
                              <path d="m17 16.5-5-3"></path>
                              <path d="m17 16.5 4.74-2.85"></path>
                              <path d="M17 16.5v5.17"></path>
                              <path d="M7.97 4.42A2 2 0 0 0 7 6.13v4.37l5 3 5-3V6.13a2 2 0 0 0-.97-1.71l-3-1.8a2 2 0 0 0-2.06 0l-3 1.8Z"></path>
                              <path d="M12 8 7.26 5.15"></path>
                              <path d="m12 8 4.74-2.85"></path>
                              <path d="M12 13.5V8"></path>
                            </svg>
                          </div>
                          <div className="flex-grow flex flex-col gap-0 min-w-0">
                            <h3 title="kynguyen" className="text-sm text-foreground mb-0 truncate max-w-full">kynguyen</h3>
                            <div className="flex items-center justify-between text-xs text-foreground-light font-sans">
                              <div className="flex items-center gap-x-1.5">
                                <span>Free Plan</span>
                                <span>•</span>
                                <span>1 project</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </a>
                    <a href="/dashboard/org/eulghqazyvmqvjvwfwqe">
                      <div className="overflow-hidden rounded-lg text-card-foreground shadow-sm grow bg-surface-100 p-3 transition-colors hover:bg-surface-200 border border-light hover:border-default cursor-pointer flex items-center min-h-[70px] [&amp;&gt;div]:w-full [&amp;&gt;div]:items-center">
                        <div className="relative flex items-start gap-3">
                          <div className="rounded-full bg border w-8 h-8 flex items-center justify-center flex-shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-boxes text-foreground">
                              <path d="M2.97 12.92A2 2 0 0 0 2 14.63v3.24a2 2 0 0 0 .97 1.71l3 1.8a2 2 0 0 0 2.06 0L12 19v-5.5l-5-3-4.03 2.42Z"></path>
                              <path d="m7 16.5-4.74-2.85"></path>
                              <path d="m7 16.5 5-3"></path>
                              <path d="M7 16.5v5.17"></path>
                              <path d="M12 13.5V19l3.97 2.38a2 2 0 0 0 2.06 0l3-1.8a2 2 0 0 0 .97-1.71v-3.24a2 2 0 0 0-.97-1.71L17 10.5l-5 3Z"></path>
                              <path d="m17 16.5-5-3"></path>
                              <path d="m17 16.5 4.74-2.85"></path>
                              <path d="M17 16.5v5.17"></path>
                              <path d="M7.97 4.42A2 2 0 0 0 7 6.13v4.37l5 3 5-3V6.13a2 2 0 0 0-.97-1.71l-3-1.8a2 2 0 0 0-2.06 0l-3 1.8Z"></path>
                              <path d="M12 8 7.26 5.15"></path>
                              <path d="m12 8 4.74-2.85"></path>
                              <path d="M12 13.5V8"></path>
                            </svg>
                          </div>
                          <div className="flex-grow flex flex-col gap-0 min-w-0">
                            <h3 title="skripter" className="text-sm text-foreground mb-0 truncate max-w-full">skripter</h3>
                            <div className="flex items-center justify-between text-xs text-foreground-light font-sans">
                              <div className="flex items-center gap-x-1.5">
                                <span>Free Plan</span>
                                <span>•</span>
                                <span>1 project</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

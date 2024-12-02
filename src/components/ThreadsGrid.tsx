"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, ArrowDown, ArrowUp, Clock, MoreVertical, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Thread } from '@/app/search/page';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

const EmptyState = () => (
  <div className="col-span-full flex items-center justify-center p-8">
    <Card className="w-full max-w-md text-center p-6">
      <CardHeader>
        <CardTitle className="text-xl">Här var det tomt! 🌱</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600">
          Dags att börja fylla på med spännande sökningar! 
          Prova att göra din första sökning ovan.
        </p>
      </CardContent>
    </Card>
  </div>
);

const ThreadsGrid = ({ initialThreads }: { initialThreads: Thread[] }) => {
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [searchQuery, setSearchQuery] = useState('');
  const [threads, setThreads] = useState(initialThreads);
  const [filteredThreads, setFilteredThreads] = useState(threads);

  useEffect(() => {
    const filtered = threads.filter(thread => 
      thread.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      thread.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredThreads(filtered);
  }, [searchQuery, threads]);

  const handleSort = (direction: 'asc' | 'desc') => {
    setSortDirection(direction);
    const sorted = [...threads].sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return direction === 'asc' ? dateA - dateB : dateB - dateA;
    });
    setThreads(sorted);
  };

  const deleteThread = async (threadId: string) => {
    try {
      const response = await fetch(`/api/assistants/threads/${threadId}/messages`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete thread');
      }

      // Remove thread from state
      setThreads(threads.filter(thread => thread.thread_id !== threadId));
    } catch (error) {
      console.error('Error deleting thread:', error);
      // Add error toast here if you have a toast system
    }
  };

  const ThreadCard = ({ thread }: { thread: Thread }) => {
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    const handleDelete = async (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setShowDeleteDialog(true);
    };

    const handleConfirmDelete = async () => {
      setIsDeleting(true);
      await deleteThread(thread.thread_id);
      setIsDeleting(false);
    };

    return (
      <>
        <Link 
          href={`/search/${thread.thread_id}`} 
          className="group block cursor-pointer"
        >
          <Card className="h-full transition-all duration-200 ease-in-out group-hover:shadow-lg 
                         group-hover:border-blue-200 group-hover:scale-[1.02]">
            <CardHeader className="flex flex-row justify-between items-start">
              <CardTitle className="text-xl group-hover:text-blue-600 transition-colors">
                {thread.title || 'Untitled Search'}
              </CardTitle>
            </CardHeader>

            <CardContent>
              {thread.description ?? 'No description available'}
            </CardContent>
            
            <CardFooter className="flex items-center justify-between border-t border-gray-100 pt-4">
              <div className="flex items-center text-gray-500">
                <Clock className="w-4 h-4 mr-1" />
                <span className="text-sm">
                  {new Date(thread.created_at).toLocaleDateString('sv-SE')}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-blue-600 text-sm font-medium group-hover:underline">
                  Visa resultat →
                </span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.preventDefault()}>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem className="text-red-600" onClick={handleDelete} disabled={isDeleting}>
                      Radera sökning
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardFooter>
          </Card>
        </Link>

        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Är du säker?</AlertDialogTitle>
              <AlertDialogDescription>
                Denna åtgärd kan inte ångras. Detta kommer permanent radera denna sökning.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Avbryt</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleConfirmDelete}
                disabled={isDeleting}
              >
                {isDeleting ? "Raderar..." : "Radera sökning"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex gap-2 flex-1 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Sök bland tidigare sökningar..."
              className="pl-10 w-full bg-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              {sortDirection === 'desc' ? <ArrowDown className="h-4 w-4" /> : <ArrowUp className="h-4 w-4" />}
              Sortera
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleSort('desc')}>
              Nyast först
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleSort('asc')}>
              Äldst först
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredThreads.length > 0 ? (
          filteredThreads.map((thread) => (
            <ThreadCard key={thread.id} thread={thread} />
          ))
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
};

export default ThreadsGrid;
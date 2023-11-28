import { Controller, Get, UseGuards, Post, Patch, Delete, Param, ParseIntPipe } from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
import { BookmarkService } from './bookmark.service';
import { GetUser } from '../auth/decorator';

@UseGuards(JwtGuard)
@Controller('bookmarks')
export class BookmarkController {
    constructor(private bookmarkService: BookmarkService){}

    @Get()
    getBookmarks(
        @GetUser('id') userId: number
    ){}

    @Get(':id')
    getBookmarkById(
        @GetUser('id') userId: number,
        @Param('id', ParseIntPipe) bookmarkId: number
    ){}

    @Post()
    createBookmark(
        @GetUser('id') userId: number
    ){}

    @Patch()
    editBookmarkById(
        @GetUser('id') userId: number
    ){}

    @Delete()
    deleteBookmarkById(
        @GetUser('id') userId: number
    ){}
}
